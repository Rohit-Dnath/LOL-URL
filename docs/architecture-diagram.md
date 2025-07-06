# Architecture Diagram

Below is a high-level architecture diagram for LOL URL.

```mermaid
graph TD
  A[User] -->|Shorten URL| B[Frontend (React/Vite)]
  B -->|API Request| C[API Server]
  C -->|DB Query| D[Supabase DB]
  C -->|Auth| E[Supabase Auth]
  B -->|Analytics| F[Analytics Dashboard]
  F -->|Data| D
```

See [ARCHITECTURE.md](../ARCHITECTURE.md) for more details.
