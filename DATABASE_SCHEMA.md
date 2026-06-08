# Database Schema Documentation

## Users

Stores authentication and profile-level data for all user roles.

- `id`
- `email`
- `password_hash`
- `name`
- `role` (customer, worker, employer, admin)
- `location`
- `bio`
- `avatar_url`
- `rating`
- `reputation`

## WorkerProfile

Extends the user profile for workers and freelancers.

- `user_id`
- `headline`
- `hourly_rate`
- `service_area`
- `availability`
- `experience_years`

## EmployerProfile

Stores employer details and connects to company data.

- `user_id`
- `company_id`
- `phone_number`

## CustomerProfile

Stores customer-specific profile metadata.

- `user_id`
- `company_name`
- `phone_number`

## Company

Contains company information for employer users.

- `owner_id`
- `name`
- `website`
- `address`
- `description`
- `logo_url`

## Job

Represents the marketplace job posting.

- `title`
- `description`
- `category`
- `location`
- `rate`
- `currency`
- `status`
- `service_radius`
- `posted_by`
- `company_id`

## Application

Stores job applications by workers.

- `job_id`
- `candidate_id`
- `cover_letter`
- `status`

## Booking

Tracks job bookings made by customers.

- `job_id`
- `customer_id`
- `worker_id`
- `status`
- `scheduled_date`
- `total_amount`

## Message & Conversation

Supports private chat and message history.

- `conversation_id`
- `sender_id`
- `receiver_id`
- `content`
- `is_read`
- `attachment_url`

## Review

Stores written feedback for completed work.

- `job_id`
- `author_id`
- `target_id`
- `rating`
- `comment`

## Notification

Tracks user notifications for events.

- `user_id`
- `title`
- `message`
- `category`
- `is_read`
- `payload`

## Payment

Tracks mock escrow and payout information.

- `user_id`
- `booking_id`
- `amount`
- `currency`
- `status`
- `transaction_reference`
- `escrow_reference`
