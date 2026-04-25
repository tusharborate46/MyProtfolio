# Modern Portfolio + Admin + Supabase

## What changed
- New website theme/template with separate frontend files:
  - `index.html`
  - `styles.css`
  - `frontend.js`
- New admin portal:
  - `admin.html`
  - `admin.js`
- New backend API:
  - `backend/server.js`
- Supabase database schema:
  - `supabase/schema.sql`

## 1) Setup Supabase database
1. Create a new project in Supabase.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy your project URL and service role key.

## 2) Setup backend
```bash
cd backend
cp .env.example .env
# fill SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PORTAL_KEY
npm install
npm start
```

## 3) Run frontend
From repo root, serve static files:
```bash
python3 -m http.server 5500
```
Open:
- Portfolio: `http://localhost:5500/index.html`
- Admin: `http://localhost:5500/admin.html`

The frontend connects to backend at `http://localhost:4000/api`.
