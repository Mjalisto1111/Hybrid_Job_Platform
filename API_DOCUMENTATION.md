# API Documentation

## Auth

- `POST /api/auth/register`
  - Registers a new user.
  - Body: `{ name, email, password, role }`

- `POST /api/auth/login`
  - Logs in a user and returns an access token.
  - Body: `{ email, password }`

- `POST /api/auth/refresh`
  - Issues a new access token using a refresh token.

- `POST /api/auth/forgot-password`
  - Sends a password reset placeholder email.
  - Body: `{ email }`

- `POST /api/auth/reset-password`
  - Sets a new password using a reset token.
  - Body: `{ token, password }`

- `POST /api/auth/verify-email`
  - Verifies a new user email address.
  - Body: `{ token }`

## Users

- `GET /api/users/profile`
  - Returns the authenticated user's profile.

- `PUT /api/users/profile`
  - Updates the authenticated user's profile.

- `GET /api/users/search`
  - Searches worker profiles by skill, location, category, rate.

- `GET /api/users/favorites`
  - Returns saved favorite workers for the authenticated customer.

- `GET /api/users/skills`
  - Returns available skill categories.

## Jobs

- `GET /api/jobs`
  - Lists open jobs.
  - Query params: `keyword`, `category`, `location`

- `POST /api/jobs`
  - Creates a new job posting (employer only).

- `GET /api/jobs/:job_id`
  - Gets details for a single job.

- `POST /api/jobs/:job_id/apply`
  - Applies to a job posting (worker only).

- `POST /api/jobs/:job_id/book`
  - Books a job for a customer.

- `GET /api/jobs/categories`
  - Returns supported job categories.

## Chat

- `GET /api/chat/conversations`
  - Lists the authenticated user's conversations.

- `POST /api/chat/conversations`
  - Creates a new conversation.

- `GET /api/chat/messages/:conversation_id`
  - Lists messages for a conversation.

- `POST /api/chat/messages`
  - Sends a chat message.

## Admin

- `GET /api/admin/users`
  - Lists all platform users (admin only).

- `GET /api/admin/jobs`
  - Lists all jobs (admin only).

- `GET /api/admin/reports`
  - Returns platform statistics (admin only).
