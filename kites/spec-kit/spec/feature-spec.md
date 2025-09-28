# Feature Spec

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
