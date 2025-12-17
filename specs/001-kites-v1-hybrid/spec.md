# Spec 001: Kites V1 Hybrid

## 1. Overview
Kites is a shared clipboard and context manager for humans and AI agents. It consists of a central web application (The Brain) and a desktop client (The Hand).

## 2. Architecture
-   **Web/API (The Brain):** Next.js 16 application hosted at `kites.runfoo.run`.
    -   **DB:** PostgreSQL (migrated from SQLite).
    -   **ORM:** Drizzle.
    -   **Auth:** NextAuth (Web) + API Key (Client).
-   **Desktop Client (The Hand):** Tauri application (React + Rust).
    -   **Sync:** Pushes clipboard history to Web API via `POST /api/v1/pastes` using `x-api-key`.
    -   **Read:** Pulls history and sessions.

## 3. Data Model
### Paste
-   `id`: Nanoid.
-   `content`: Text content.
-   `syntax`: Language detection.
-   `sessionId`: Link to an Agent Run/Session.
-   `visibility`: 'public' | 'private' | 'unlisted'.

### Session (Agent Run)
-   `id`: Nanoid.
-   `title`: "Refactor Auth" or "Daily Log".
-   `agentName`: "Claude", "GPT-4".

## 4. API Endpoints
-   `POST /api/v1/pastes`: Create paste (API Key supported).
-   `GET /api/v1/pastes`: List pastes.
-   `POST /api/v1/sessions`: Create session.
-   `GET /api/v1/sessions`: List sessions.

## 5. Deployment
-   **Host:** Nexus Vector.
-   **Orchestration:** Docker Compose.
-   **Routing:** Traefik (`kites.runfoo.run`).
