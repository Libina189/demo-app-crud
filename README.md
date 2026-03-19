# Interview Boilerplate — FastAPI + React + SQLite

## Project Structure

```
boilerplate/
├── backend/
│   ├── main.py          # FastAPI app, all routes
│   ├── database.py      # SQLAlchemy engine + session
│   ├── models.py        # ORM models (DB tables)
│   ├── schemas.py       # Pydantic request/response schemas
│   └── requirements.txt
└── frontend/
    └── src/
        └── App.jsx      # React app with full CRUD UI
```

---

## Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
# → Running at http://localhost:8000
# → Docs at http://localhost:8000/docs  ← use this to test!
```

---

## Frontend Setup

```bash
# From project root — scaffold with Vite if not already done:
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Replace src/App.jsx with the provided file, then:
npm run dev
# → Running at http://localhost:5173
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /health | Health check |
| GET | /items | List all items |
| GET | /items/{id} | Get one item |
| POST | /items | Create item |
| PUT | /items/{id} | Update item |
| DELETE | /items/{id} | Delete item |

---

## How to Extend for the Interview

### Add a new field to the model:
1. Add column to `models.py`
2. Add field to `schemas.py`
3. Update the route in `main.py`
4. Update the form in `App.jsx`

### Add a new endpoint:
1. Add a route function in `main.py`
2. Add a new fetch call in `App.jsx`

### Common interview extension ideas:
- Add a `status` field (e.g., pending/approved/rejected) — very Upstart-flavored
- Add filtering/search: `GET /items?name=foo`
- Add pagination: `GET /items?skip=0&limit=10`
- Add a second model with a foreign key relationship
