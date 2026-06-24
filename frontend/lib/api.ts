// API client for the FastAPI backend. The chat endpoint streams Server-Sent Events; we parse the
// stream incrementally and call onToken for each chunk so the UI types out the answer live.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type StreamHandlers = {
  onSources?: (sources: string[]) => void;
  onToken: (token: string) => void;
  onError?: (message: string) => void;
  onDone?: () => void;
};

export async function streamChat(
  message: string,
  history: ChatMessage[],
  handlers: StreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    signal,
  });

  if (!res.ok || !res.body) {
    handlers.onError?.(`Request failed (${res.status})`);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json) continue;
      try {
        const evt = JSON.parse(json);
        if (evt.sources) handlers.onSources?.(evt.sources);
        if (evt.token) handlers.onToken(evt.token);
        if (evt.error) handlers.onError?.(evt.error);
        if (evt.done) handlers.onDone?.();
      } catch {
        // ignore malformed partial frames
      }
    }
  }
  handlers.onDone?.();
}
