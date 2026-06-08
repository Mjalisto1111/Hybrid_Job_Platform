FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir pip setuptools wheel
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Use Render's $PORT and eventlet worker for WebSocket support
CMD ["gunicorn", "-k", "eventlet", "backend.app:app", "--bind", "0.0.0.0:$PORT", "--workers", "1"]
