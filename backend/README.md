# Python Backend (FastAPI)

This folder contains the backend API for the frontend app.

## Setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Health Check

- `GET http://localhost:8000/health`

## Frontend CORS

CORS is enabled for local frontend dev URLs:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://192.168.4.42:5173`
