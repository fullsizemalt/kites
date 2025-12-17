# Project Constitution

1.  **Hybrid Architecture:** Kites is a hybrid platform. The "Brain" is a Next.js web application (Nexus/Web), and the "Hand" is a native Desktop Client (Tauri).
2.  **Privacy-First:** User data is sensitive. Default to private visibility. API access requires strict authentication (Session or API Key).
3.  **Agent-Native:** We build for both humans and AI. The data model (Sessions, Tags, Content) must support structured agent output (e.g., "Run ID", "Agent Name").
4.  **Spec-Driven:** Major changes start with a spec in `specs/`. We document *why* before we code *how*.
5.  **Infrastructure:** We deploy to a self-hosted VPS (Nexus Vector) using Docker Compose and Traefik. Database is PostgreSQL.
