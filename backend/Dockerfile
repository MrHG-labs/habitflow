FROM python:3.12-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set working directory
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy project files
COPY pyproject.toml uv.lock ./

# Install dependencies GLOBALLY (system-wide) to avoid venv mapping issues
RUN uv pip install --system --no-cache email-validator fastapi uvicorn[standard] sqlmodel sqlalchemy psycopg2-binary "python-jose[cryptography]" "pwdlib[argon2]" pydantic pydantic-settings python-multipart alembic ruff

# Copy the rest of the application
COPY . .

# Expose the API port
EXPOSE 8000

# Start the uvicorn server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]