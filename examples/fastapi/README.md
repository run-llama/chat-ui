# FastAPI + ChatUI Example

This is an example fullstack application that uses FastAPI for the backend and `@llamaindex/chat-ui` with NextJS for the frontend.
The backend just send example data to the frontend.

## 🚀 Quick Start

### Prerequisites

- uv (recommended) for Python package management
- pnpm for JavaScript package management

### Start the app

### Backend

Navigate to the current directory, and run:

1. **Create a virtual environment and install dependencies using uv (recommended):**

   ```bash
   uv sync
   ```

2. **Start a FastAPI server:**
   ```bash
   uv run fastapi dev
   ```

The API will be available at `http://localhost:8000` and you can check the API documentation at `http://localhost:8000/docs`.

### Frontend

Navigate to `frontend`, then build and run the development server:

```bash
cd frontend
pnpm install
pnpm build
pnpm run dev
```

Go to `http://localhost:3000` to see the chat UI.

## Test with different events:

Go to [backend/app/chat.py](backend/app/chat.py) to send different events from the backend to test the UI components.
