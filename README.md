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

**Deployment & Setup — Step by Step**

**Prerequisites:**
- Install Git, Docker (optional), Node.js (16+), Python 3.11+ and pip.
- Create a GitHub repository and (optionally) a Render account for deployment.

**Local: Backend (development)**
1. Open a terminal and create a Python venv inside `backend`:
   ```powershell
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and update values (see Environment Variables below).
3. Run the backend locally:
   ```powershell
   python app.py
   # or for Socket.IO development
   flask run
   ```

**Local: Frontend (development)**
1. Install dependencies and run dev server:
   ```powershell
   cd frontend
   npm ci
   npm run dev
   ```
2. Edit `frontend/.env` (copy from `.env.example`) and set `VITE_API_BASE_URL` to `http://localhost:5000/api`.

**Docker (optional, full stack)**
1. From the project root, build and run with Docker Compose:
   ```bash
   docker compose up --build
   ```
2. Services included: `db` (Postgres), `backend`, `frontend`.

**GitHub — push repository**
1. From project root run:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<youruser>/<repo>.git
   git push -u origin main
   ```
2. If prompted for credentials use your GitHub username and a Personal Access Token (PAT).

**Deploy to Render — quick steps**
- Backend: Create a Render Web Service. Use the `backend/Dockerfile` or set a start command: `gunicorn -k eventlet -w 1 backend.app:app --bind 0.0.0.0:$PORT` (add `eventlet` to `requirements.txt` if using websockets). Point Render to the repository and the `backend` folder.
- Frontend: Create a Render Static Site. Build command: `npm ci && npm run build`. Publish directory: `dist` (or `frontend/dist` depending on build output). Set `VITE_API_BASE_URL` to your backend URL (e.g. `https://your-backend.onrender.com/api`).
- Database: Create a Render Postgres instance and copy its connection string into `SQLALCHEMY_DATABASE_URI` for the backend service.
- Redis (optional): Add a Redis instance for Socket.IO message queue and set `SOCKETIO_MESSAGE_QUEUE` to the redis URL.

**Environment variables (summary)**
- `SECRET_KEY` — Flask secret, strong random string.
- `JWT_SECRET_KEY` — JWT signing secret.
- `SQLALCHEMY_DATABASE_URI` — Postgres connection string (from Render DB).
- `FRONTEND_URL` — frontend origin (e.g. `https://your-frontend.onrender.com`).
- `VITE_API_BASE_URL` (frontend) — API base URL for frontend calls (e.g. `https://your-backend.onrender.com/api`).
- `CLOUDINARY_URL` — optional Cloudinary URL for uploads.
- `SOCKETIO_MESSAGE_QUEUE` — optional Redis URL (e.g. `redis://:password@host:6379/0`).
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — used to auto-create an admin user on first run.
- `FLASK_ENV` and `FLASK_DEBUG` — optional; set `FLASK_ENV=production` and `FLASK_DEBUG=False` in production.

**Production Socket.IO notes**
- For reliable Socket.IO in production, use an async worker (`eventlet` or `gevent`) or deploy using the `backend/Dockerfile` with `eventlet` added to `requirements.txt`.
- If you scale the backend to multiple instances, configure `SOCKETIO_MESSAGE_QUEUE` with Redis so Socket.IO pub/sub works across instances.

**Troubleshooting**
- Backend not starting: check `SQLALCHEMY_DATABASE_URI` and `SECRET_KEY`.
- Frontend cannot reach backend: verify `VITE_API_BASE_URL` and CORS `FRONTEND_URL`.
- Socket errors: add `eventlet` to `requirements.txt` and start Gunicorn with `-k eventlet`.

**Next steps**
- Create Render services and set the environment variables in Render's dashboard.
- Optionally enable automatic deploys from `main` branch in Render.

If you'd like, I can: (a) add `eventlet` to `backend/requirements.txt` and update Dockerfile, or (b) prepare a Render-ready checklist file. Tell me which.
