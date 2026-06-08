# Installation Guide

## Backend

1. Change into the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and update the required values.
5. Start the backend service:
   ```bash
   python app.py
   ```

## Frontend

1. Change into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update `VITE_API_BASE_URL`.
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Docker

1. From the repository root, run:
   ```bash
   docker compose up --build
   ```
2. The frontend will be available on `http://localhost:5173` and the backend on `http://localhost:5000`.
