FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false

RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	gcc \
	libpq-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install runtime dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application
COPY . /app

# Ensure charts storage directory exists and is writable
ENV STORAGE_PATH=/app/charts
RUN mkdir -p ${STORAGE_PATH} && chown -R root:root ${STORAGE_PATH}

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
