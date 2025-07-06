# Database Schemas

This document details the Supabase table schemas for LOL URL.

## Table: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

## Table: urls
```sql
CREATE TABLE urls (
  id UUID PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  user_id UUID REFERENCES users(id)
);
```

## Table: clicks
```sql
CREATE TABLE clicks (
  id UUID PRIMARY KEY,
  url_id UUID REFERENCES urls(id),
  clicked_at TIMESTAMP DEFAULT now(),
  location TEXT,
  device TEXT
);
```

See [docs/database.md](./database.md) for the ER diagram and overview.
