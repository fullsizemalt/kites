# Implementation Tasks

## Milestone 1: Core GA
- Implement API with full session and snippet CRUD (FR-001).
- Context window expansion and raw formatting endpoint (FR-002, FR-003).
- Session summaries, stats, session export/import (FR-004, FR-007).
- Docker Compose setup for local dev and initial deployment.
- Initial SDK implementations with retries.

## Milestone 2: Extensions & Daemon
- Develop browser extension for snippet capture with provenance (FR-009).
- Develop clipboard daemon for system clipboard capture and enforced redaction rules (FR-010).
- Integrate worker jobs for redaction and sanitation (FR-005, FR-006).

## Milestone 3: Overlays
- Build overlay service supporting streamer mode and OBS integration (FR-008).
- Implement WebSocket events for real-time overlay updates.

## Milestone 4: Profiles & Themes
- Implement user profiles with identity and theming support (FR-011).
- Web UI enhancements for profile/theme management.

## Milestone 5: Operational Hardening
- Metrics collection and SLO enforcement (NFR-001 to NFR-004).
- Backup and restore workflows.
- Enhanced logging, alerting, and runbooks.
