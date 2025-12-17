# Kites - Agentic Pastebin

Kites is a clean, agent-native pastebin service designed for LLMs and humans. It features a simple API, structured data model (Sessions, Tags), and a polished UI.

## Features

-   **Agent-First API**: Simple REST endpoints for creating and retrieving pastes.
-   **Sessions**: Group pastes by "run" or logical session.
-   **Tags**: Organize pastes with tags.
-   **Syntax Highlighting**: Automatic highlighting for various languages.
-   **Theming**: Light and Dark mode support.
-   **Self-Hostable**: Built with Next.js and SQLite for easy deployment.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Database**: SQLite
-   **ORM**: Drizzle ORM
-   **Styling**: Tailwind CSS v4
-   **Validation**: Zod

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/fullsizemalt/kites.git
    cd kites
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Initialize the database:
    ```bash
    npx drizzle-kit push
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## API Usage

### Create a Paste

```bash
curl -X POST http://localhost:3000/api/v1/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "console.log(\"Hello Kites!\");",
    "title": "My First Paste",
    "syntax": "javascript",
    "tags": ["demo", "js"]
  }'
```

### Get a Paste (Raw)

```bash
curl http://localhost:3000/api/v1/pastes/<PASTE_ID>?raw=1
```

### Create a Session

```bash
curl -X POST http://localhost:3000/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Agent Run 101",
    "agentName": "GPT-4"
  }'
```

## Agent Example

See `examples/agent_usage.py` for a Python script that demonstrates how an agent can interact with Kites.

```bash
python3 examples/agent_usage.py
```
