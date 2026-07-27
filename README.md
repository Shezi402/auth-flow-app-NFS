# Auth Flow App — Week 2 Task (Neuro Five Solutions)

A complete signup → login → protected page → logout → blocked-when-logged-out flow, built as a
standalone MERN app.

**Stack:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt — React (Vite) + React Router on the frontend.

## What's implemented

- Signup form with client-side validation (name, email format, password rules: 8+ chars,
  uppercase, lowercase, number, confirm-password match)
- Login form with client-side validation
- Backend hashes passwords with bcrypt (12 salt rounds) before storing
- Backend issues a JWT on signup/login (`JWT_SECRET`, 1-day expiry by default)
- Frontend stores the JWT in `localStorage` and attaches it as `Authorization: Bearer <token>`
  on every authenticated request
- `/dashboard` is a protected route — `ProtectedRoute` checks the session via `GET /api/auth/me`
  and redirects unauthenticated users to `/login`
- Logout clears the token from `localStorage` and resets app state
- Rate limiting on the login endpoint (20 attempts / 15 min) as basic brute-force protection

## Project structure

```
auth-flow-app/
  backend/
    config/db.js
    models/User.js
    middleware/authMiddleware.js   # verifies JWT, protects routes
    middleware/validate.js         # server-side validation
    routes/authRoutes.js           # /signup /login /logout /me
    server.js
    .env.example
  frontend/
    src/
      api/apiClient.js             # fetch wrapper, attaches JWT
      context/AuthContext.jsx      # global auth state, signup/login/logout
      context/ProtectedRoute.jsx   # route guard
      pages/Home.jsx Login.jsx Signup.jsx Dashboard.jsx
      App.jsx main.jsx index.css
    .env.example
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — local Mongo (`mongodb://127.0.0.1:27017/auth_flow_db`) or a MongoDB Atlas
  connection string
- `JWT_SECRET` — replace with a long random string (e.g. `openssl rand -hex 32`)

Run it:
```bash
npm run dev
```
Server starts on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
App runs on `http://localhost:5173`.

## Testing the flow before recording

1. Go to `/signup`, create an account → redirected to `/dashboard`
2. Refresh the page → still logged in (token persists in `localStorage`, validated via `/api/auth/me`)
3. Click Logout → redirected, token cleared
4. Try visiting `/dashboard` directly while logged out → bounced to `/login`
5. Log back in with the same credentials → back on `/dashboard`

## Recording the demo video (for the task + LinkedIn post)

Suggested order to record, matches the task requirement exactly:
1. Show the signup form, submit with a new account → land on protected Dashboard
2. Show `localStorage` in DevTools (Application tab) with the JWT present
3. Logout → show `localStorage` token is gone, redirected to `/login`
4. Try to manually navigate to `/dashboard` → show it redirects to `/login` (proves the guard works)
5. Log back in → back on Dashboard

Keep it under 2 minutes, screen-record with your voice explaining what's happening at each step,
then post it on LinkedIn tagging Neuro Five Solutions with a short caption about what you built.
