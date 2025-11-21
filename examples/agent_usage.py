import requests
import json
import time

BASE_URL = "http://localhost:3000/api/v1"

def create_session(title, agent_name):
    print(f"Creating session: {title}...")
    response = requests.post(f"{BASE_URL}/sessions", json={
        "title": title,
        "agentName": agent_name
    })
    response.raise_for_status()
    data = response.json()
    print(f"Session created: {data['id']}")
    return data['id']

def create_paste(content, title=None, session_id=None, tags=None, syntax=None):
    print(f"Creating paste: {title}...")
    payload = {
        "content": content,
        "title": title,
        "sessionId": session_id,
        "tags": tags or [],
        "syntax": syntax,
        "visibility": "public"
    }
    response = requests.post(f"{BASE_URL}/pastes", json=payload)
    response.raise_for_status()
    data = response.json()
    print(f"Paste created: {data['id']} (URL: http://localhost:3000/paste/{data['id']})")
    return data['id']

def get_session_pastes(session_id):
    print(f"Fetching pastes for session {session_id}...")
    response = requests.get(f"{BASE_URL}/sessions/{session_id}/pastes")
    response.raise_for_status()
    pastes = response.json()
    print(f"Found {len(pastes)} pastes.")
    for p in pastes:
        print(f" - {p['title']}: {p['id']}")

def main():
    # 1. Create a session
    session_id = create_session("Refactor Run #1", "Antigravity Agent")

    # 2. Create some pastes
    create_paste(
        content="print('Hello World')",
        title="Hello World Python",
        session_id=session_id,
        tags=["python", "example"],
        syntax="python"
    )

    create_paste(
        content="SELECT * FROM users;",
        title="User Query",
        session_id=session_id,
        tags=["sql", "db"],
        syntax="sql"
    )

    # 3. List pastes in session
    get_session_pastes(session_id)

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to Kites API. Make sure the server is running on http://localhost:3000")
