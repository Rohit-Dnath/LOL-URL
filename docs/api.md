# API Endpoints

This document lists the main API endpoints for LOL URL.

## URL Shortening
- `POST /api/shorten` — Create a new short URL
- `GET /api/:short_code` — Redirect to the original URL

## Analytics
- `GET /api/analytics/:short_code` — Get analytics for a short URL

## User
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Log in
- `GET /api/user/urls` — List user's URLs

See [docs/database.md](./database.md) and [docs/schemas.md](./schemas.md) for data models.
