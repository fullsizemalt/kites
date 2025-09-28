import os

# Root project directory
root_dir = "kites"

# Major project subfolders
subfolders = [
    "api",
    "worker-jobs",
    "web-ui",
    "overlay-service",
    "browser-extension",
    "clipboard-daemon",
    "storage",
    "sdk",
    "docs",
    "tests",
    "scripts",
    "config",
    "metrics",
    "security",
    "spec-kit/spec",
    "spec-kit/plan",
    "spec-kit/tasks"
]

# Create directories
for folder in subfolders:
    os.makedirs(os.path.join(root_dir, folder), exist_ok=True)

# Spec Kit markdown contents
feature_spec_md = """# Feature Spec

## Overview
Kites is a secure, structured snippet service for curated text, code, and images. It supports AI agent CLIs, developers, teams, self-hosters, and streamers. The system prioritizes reliable snippet capture, privacy-preserving self-hosting, fast retrieval, CLI-ready formatting, and streamer-friendly overlays.

## Goals
- Enable fast, reliable snippet capture with p95 write latency under 400ms.
- Ensure full secret redaction with 100% test coverage.
- Enable session import/export with no data loss.
- Provide overlays for streamers with real-time updates.
- Allow AI agents full programmatic access for autonomous operation.
- Operate self-hosted with strong privacy and security.

## User Stories
- As an AI agent CLI, I want to programmatically create, read, update, and delete snippets with context so I can automate snippet handling.
- As a developer, I want fast read/write APIs with low latency and raw formatted snippet retrieval for seamless CLI integration.
- As a streamer, I want live snippet overlays in OBS with low latency for dynamic display on streams.
- As a self-hosting team, I want privacy controls including secret redaction, zero-knowledge mode, and audit logging.
- As an end-user, I want a browser extension and clipboard daemon to capture snippets with metadata and enforce security policies.

## Acceptance Criteria
- Snippet CRUD with tags, categories, and context expansion works with latency goals met.
- Raw snippet retrieval excludes line numbers and matches displayed content exactly.
- Secret redaction masks all seeded secrets in test corpus.
- Session URLs expire and revoked sessions return HTTP 410.
- Overlay updates propagate to OBS with ≤150ms p95 latency.
- Clipboard daemon blocks sensitive data automatically.
- Browser extension captures page selections with provenance metadata.
"""

technical_plan_md = """# Technical Plan

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
"""

tasks_md = """# Implementation Tasks

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
"""

gitignore_content = """# Node.js
node_modules/
dist/
.env

# Logs
logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
"""

license_content = """MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full MIT license text...]
"""

readme_content = """# Kites

Kites is a secure, structured snippet service designed for AI agent CLIs, developers, teams, self-hosters, and streamers. This project follows spec-driven development with GitHub Spec Kit for agentic operation.

## Structure

- api/: Backend API service
- worker-jobs/: Background jobs for redaction, summaries, sanitation
- web-ui/: Next.js management and monitoring UI
- overlay-service/: Streamer overlays with OBS integration
- browser-extension/: Browser extension for capture
- clipboard-daemon/: Clipboard capture and enforcement daemon
- storage/: Database and storage configuration
- sdk/: Client SDKs for integrations
- docs/: Documentation and runbooks
- tests/: End-to-end tests
- scripts/: Deployment and operational scripts
- config/: Configuration files and secrets management
- metrics/: Metrics and alerting setup
- security/: Security tooling and audit logs
- spec-kit/: GitHub Spec Kit for specs, plan, and tasks

## Getting Started

TODO: Add development and deployment instructions.

"""

# Write main repo files
with open(os.path.join(root_dir, ".gitignore"), "w") as f:
    f.write(gitignore_content)

with open(os.path.join(root_dir, "LICENSE"), "w") as f:
    f.write(license_content)

with open(os.path.join(root_dir, "README.md"), "w") as f:
    f.write(readme_content)

# Write stub README.md files in each subfolder
for folder in subfolders:
    readme_path = os.path.join(root_dir, folder, "README.md")
    with open(readme_path, "w") as f:
        folder_name = folder.replace("-", " ").title()
        f.write(f"# {folder_name}\n\nPlaceholder README for {folder}.")

# Write Spec Kit markdown files
with open(os.path.join(root_dir, "spec-kit", "spec", "feature-spec.md"), "w") as f:
    f.write(feature_spec_md)

with open(os.path.join(root_dir, "spec-kit", "plan", "technical-plan.md"), "w") as f:
    f.write(technical_plan_md)

with open(os.path.join(root_dir, "spec-kit", "tasks", "implementation-tasks.md"), "w") as f:
    f.write(tasks_md)

print("GitHub repo-ready Kites project structure generated successfully.")
