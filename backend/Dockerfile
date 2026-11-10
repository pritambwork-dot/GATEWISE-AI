# Multi-stage production Dockerfile for GATEWISE AI Core Backend
# Python 3.11/3.13 slim-bookworm with OpenCV YuNet & SFace models

# Stage 1: Build & Dependencies
FROM python:3.11-slim-bookworm AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Hardened Runtime Container
FROM python:3.11-slim-bookworm AS runner

# Create non-root system user
RUN groupadd -g 10001 gatewise && \
    useradd -u 10001 -g gatewise -m -s /bin/bash gatewise

WORKDIR /app

# Install runtime shared libraries required by OpenCV headless and PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /root/.local /home/gatewise/.local
ENV PATH=/home/gatewise/.local/bin:$PATH
ENV PYTHONPATH=/app

# Copy application source code
COPY --chown=gatewise:gatewise . /app

# Ensure weights directory and database storage permissions
RUN mkdir -p /app/storage /app/models && \
    chown -R gatewise:gatewise /app

USER gatewise

# Expose backend port
EXPOSE 8000

# Healthcheck targeting FastAPI /health endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production entrypoint with multi-worker Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers", "--forwarded-allow-ips", "*"]
