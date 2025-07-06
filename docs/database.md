# Database Overview

This document describes the database structure and storage for LOL URL.

## Supabase Tables

### urls
- id (UUID, PK)
- original_url (text)
- short_code (text, unique)
- created_at (timestamp)
- user_id (UUID, FK)

### clicks
- id (UUID, PK)
- url_id (UUID, FK)
- clicked_at (timestamp)
- location (text)
- device (text)

### users
- id (UUID, PK)
- email (text, unique)
- created_at (timestamp)

## Entity Relationship Diagram

```mermaid
erDiagram
  users ||--o{ urls : owns
  urls ||--o{ clicks : has
  users {
    UUID id
    text email
    timestamp created_at
  }
  urls {
    UUID id
    text original_url
    text short_code
    timestamp created_at
    UUID user_id
  }
  clicks {
    UUID id
    UUID url_id
    timestamp clicked_at
    text location
    text device
  }
```

See [docs/schemas.md](./schemas.md) for detailed schema definitions.
