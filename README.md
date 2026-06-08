# SkillConnect SA

SkillConnect SA is a full-stack service marketplace platform that connects customers, workers, freelancers, employers, and administrators.

## Project Structure

- `/backend` — Flask REST API, JWT authentication, PostgreSQL models, SocketIO chat, Cloudinary placeholders
- `/frontend` — React, Tailwind CSS, React Router, Axios, responsive dashboard, marketplace views
- `docker-compose.yml` — Postgres, backend, frontend services

## Local Setup

### Backend

1. Create a Python virtual environment inside `/backend`
   ```bash
   python -m venv venv
   ```
2. Activate it and install dependencies
   ```bash
   cd backend
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create `.env` from `.env.example` and update values.
4. Run the backend server
   ```bash
   python app.py
   ```

### Frontend

1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env` from `.env.example` and point `VITE_API_BASE_URL` to the backend.
3. Start the frontend
   ```bash
   npm run dev
   ```

### Docker

Run the full stack with Docker Compose:

```bash
docker compose up --build
```

## Features Included

- Role-based authentication for Customer, Worker, Employer, Admin
- User registration, login, email verification, password reset placeholders
- Job marketplace with categories, search, application, and booking endpoints
- Real-time chat socket handlers with typing and room support
- Postgres database design with normalized SQLAlchemy models
- Responsive React dashboard, marketplace, chat, and admin pages
- Docker-ready backend and frontend containers

## Notes

This implementation includes a complete application skeleton with working frontend/back-end integration and deployment support. Some production services such as email delivery and Cloudinary uploads are provided as placeholder integrations.
