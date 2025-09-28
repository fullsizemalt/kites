# Technical Plan

## Architecture & Stack
- API: Fastify (Node.js) with OpenAPI v3 spec, alternative Go backend planned.
- Worker jobs: asynchronous redaction, summaries, screenshot sanitation.
- Web UI: Next.js for management and monitoring.
- Overlay service: supports streaming software (OBS).
- Browser extension: MV3, captures page selections.
- Clipboard daemon: Electron/Tauri app for system clipboard capture and rule enforcement.
- Storage: PostgreSQL (prod), SQLite (dev), Redis for job management, S3/MinIO for binaries/screenshots.

## Key Models
- Session: Aggregates snippets, context windows, metadata.
- Snippet: Individual captured content with tags and categories.
- Overlay: Configuration for streamer displays.
- Profile: User identity and theming.
- Secrets: Redaction patterns and encryption keys.

## Interfaces
- REST API endpoints for session, snippets, redaction, export, profile, overlays.
- WebSocket/SSE for overlay live updates.
- SDKs (Node, Python, Go) with idempotency and retries.

## Security & Privacy
- OAuth2 client credentials and PATs with scoped permissions.
- Session URLs signed and expiring via JWT/JWE.
- Deterministic redaction and entropy heuristics.
- Zero-knowledge encryption option with user-managed keys.
- Append-only audit logs for admin actions and sensitive read records.

## Scalability
- Single-node for self-host users.
- HA cluster option with PostgreSQL replication and Redis clustering for teams.
