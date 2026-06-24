FROM python:3.12-slim

WORKDIR /app

# System deps for chromadb / onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# The vector index is built at container startup (see start.sh), not at build time,
# so the embedding API key is only needed at runtime.
EXPOSE 8000
CMD ["sh", "start.sh"]
