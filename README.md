<div align="center">

<img src="./assets/banner.svg" alt="Notes Vault banner" width="100%" />

<br/>

<a href="https://github.com/YOUR-USERNAME/notes-vault">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1200&color=818CF8&center=true&vCenter=true&width=640&lines=Full-stack+CRUD+%2B+Authentication;bcrypt-hashed+passwords+%F0%9F%94%90;JWT+auth+with+protected+routes+%F0%9F%9B%A1%EF%B8%8F;React+%E2%86%92+Express+%E2%86%92+PostgreSQL;Deployed+on+Vercel%2C+Railway+and+Neon+%F0%9F%9A%80" alt="Typing animation" />
</a>

<br/><br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_App-4f46e5?style=for-the-badge&logo=vercel&logoColor=white)](https://YOUR-APP.vercel.app)
[![API Health](https://img.shields.io/badge/API-Health_Check-10b981?style=for-the-badge&logo=railway&logoColor=white)](https://YOUR-APP.up.railway.app/health)

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

---

## ✨ What is this?

**Notes Vault** is a personal notes app built from scratch to demonstrate how a real full-stack application fits together: a React frontend, a REST API, a relational database, secure authentication, and per-user data isolation, deployed across three separate platforms.

Users sign up, log in, and create, read, update, and delete **only their own notes**. Even if someone guesses another user's note ID, the API treats it as if it doesn't exist.

<div align="center">

<!-- Replace with a real screenshot or GIF: record with ScreenToGif (Windows) and save to assets/demo.gif -->
<!-- <img src="./assets/demo.gif" alt="Notes Vault demo" width="80%" /> -->

</div>

## 🎯 Features

| | Feature | Details |
|---|---|---|
| 🔐 | **Secure signup & login** | Passwords hashed with bcrypt (cost 12), never stored in plain text |
| 🎟️ | **JWT authentication** | Stateless tokens issued on login, verified on every protected request |
| 🛡️ | **Per-user data isolation** | Every query is scoped by the `userId` from the verified token |
| 📝 | **Full CRUD** | Create, read, update, and delete notes from a clean UI |
| ✅ | **Input validation** | Zod schemas reject bad input before it reaches the database |
| 🚦 | **Rate limiting** | Slows brute-force attempts on auth endpoints |
| 🪖 | **Security headers** | Helmet plus a locked-down CORS origin |
| 🌗 | **Light & dark mode** | Follows the system theme |
| 🔁 | **Session persistence** | Stays logged in on refresh, auto-logout when the token expires |

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Browser
      A[React + Vite<br/>Vercel]
    end
    subgraph Server
      B[Express REST API<br/>Railway]
    end
    subgraph Data
      C[(PostgreSQL<br/>Neon)]
    end

    A -- "JSON over HTTPS<br/>Authorization: Bearer JWT" --> B
    B -- "Prisma ORM" --> C
    C -- rows --> B
    B -- "JSON + status codes" --> A
```

## 🔑 How authentication works

```mermaid
sequenceDiagram
    autonumber
    participant U as User (React)
    participant API as Express API
    participant DB as PostgreSQL

    U->>API: POST /api/auth/register (email, password)
    API->>API: bcrypt.hash(password, 12)
    API->>DB: INSERT user (email, passwordHash)
    API-->>U: 201 Created

    U->>API: POST /api/auth/login (email, password)
    API->>DB: Find user by email
    API->>API: bcrypt.compare(password, hash)
    API-->>U: 200 + signed JWT (expires in 1 day)

    U->>API: GET /api/notes (Authorization: Bearer JWT)
    API->>API: jwt.verify() then req.userId
    API->>DB: SELECT notes WHERE userId = req.userId
    API-->>U: 200 + only MY notes
```

### Why 404 and not 403?

When you request a note that belongs to someone else, the API returns **`404 Not found`**. A `403` would confirm the note exists. Returning `404` means an attacker can't even enumerate valid IDs.

## 🧰 Tech stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,nodejs,express,postgres,prisma,vercel,git&perline=8" alt="Tech stack icons" />

</div>

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev server, zero-config deploy on Vercel |
| Routing | React Router | Client-side routes with protected and guest-only guards |
| Backend | Node.js + Express | Minimal and explicit, so middleware and auth are easy to follow |
| Database | PostgreSQL on Neon | Relational data fits users → notes, with a free serverless tier |
| ORM | Prisma 6 | Type-safe queries, readable schema, painless migrations |
| Auth | bcrypt + JWT | Stateless, works across separate frontend and backend domains |
| Validation | Zod | Schema-based input checking |
| Hosting | Vercel · Railway · Neon | Git-based deploys, free or cheap tiers |

## 📡 API reference

Base URL: `https://YOUR-APP.up.railway.app/api`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/health` | ❌ | Health check (served at the root, not under `/api`) |
| `POST` | `/auth/register` | ❌ | Create an account |
| `POST` | `/auth/login` | ❌ | Log in and receive a JWT |
| `GET` | `/notes` | ✅ | List my notes |
| `GET` | `/notes/:id` | ✅ | Get one of my notes |
| `POST` | `/notes` | ✅ | Create a note |
| `PUT` | `/notes/:id` | ✅ | Update one of my notes |
| `DELETE` | `/notes/:id` | ✅ | Delete one of my notes |

<details>
<summary><b>📦 Example requests and responses</b></summary>

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{ "email": "alice@test.com", "password": "password123" }
```
```json
{ "id": 1, "email": "alice@test.com" }
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "alice@test.com", "password": "password123" }
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "alice@test.com" }
}
```

**Create a note**
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{ "title": "Groceries", "content": "milk, eggs" }
```
```json
{
  "id": 1,
  "title": "Groceries",
  "content": "milk, eggs",
  "userId": 1,
  "createdAt": "2026-10-21T13:10:59.000Z",
  "updatedAt": "2026-10-21T13:10:59.000Z"
}
```

**Status codes used**

| Code | Meaning |
|---|---|
| `200` / `201` / `204` | Success / created / deleted |
| `400` | Invalid input |
| `401` | Missing, invalid, or expired token, or bad credentials |
| `404` | Note not found (or not yours) |
| `409` | Email already registered |
| `429` | Too many auth attempts |

</details>

## 🗂️ Project structure

```
notes-vault/
├── assets/
│   └── banner.svg
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # User and Note models
│   │   └── migrations/            # Database version history
│   ├── src/
│   │   ├── lib/prisma.js          # Single shared Prisma client
│   │   ├── middleware/auth.js     # requireAuth (JWT verification)
│   │   ├── routes/auth.js         # register and login
│   │   ├── routes/notes.js        # notes CRUD (ownership-scoped)
│   │   └── index.js               # app setup, CORS, helmet, rate limit
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api.js                 # fetch helper (token header, error handling)
    │   ├── AuthContext.jsx        # login, register, logout, session state
    │   ├── pages/
    │   │   ├── AuthPage.jsx       # shared login/register form
    │   │   └── Notes.jsx          # notes UI
    │   ├── App.jsx                # routes and ProtectedRoute / GuestRoute
    │   └── index.css
    ├── vercel.json                # SPA rewrite
    └── package.json
```

## 🚀 Run it locally

**Prerequisites:** Node 20+, Git, and a free [Neon](https://neon.tech) account (or any PostgreSQL database).

```bash
# 1. Clone
git clone https://github.com/YOUR-USERNAME/notes-vault.git
cd notes-vault
```

**Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=generate-a-long-random-string
FRONTEND_URL=http://localhost:5173
```

Generate a secret (works on Windows, macOS, and Linux):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
npx prisma migrate dev     # creates the tables
npm run dev                # API on http://localhost:4000
```

**Frontend** (in a second terminal)

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

```bash
npm run dev                # App on http://localhost:5173
```

Open **http://localhost:5173**, create an account, and start writing notes.

## 🔒 Security notes

- Passwords are **hashed with bcrypt (cost 12)** and capped at 72 bytes, bcrypt's real input limit.
- Login returns the **same error** for "unknown email" and "wrong password", and does a dummy hash compare so response time doesn't reveal which emails exist.
- JWTs are signed with `HS256` (algorithm pinned on verify) and expire after **1 day**.
- All note queries filter on `userId` taken from the **verified token**, never from the request body or URL.
- `helmet` sets secure headers, CORS only allows the configured frontend origin, and auth routes are **rate limited**.
- Request bodies are size-limited and validated with Zod.
- Secrets live only in environment variables, and `.env` files are git-ignored.

<details>
<summary><b>⚠️ Known trade-offs</b></summary>

- The JWT is stored in `localStorage`, which is simple and works across domains but is exposed if an XSS bug is ever introduced. An `httpOnly` cookie is the stronger upgrade.
- Tokens can't be revoked before they expire (no refresh-token or blocklist system yet).
- The rate limiter keeps counts in memory, so it resets on restart and isn't shared across multiple server instances.

</details>

## ☁️ Deployment

| Service | Role | Key settings |
|---|---|---|
| **Neon** | PostgreSQL database | Direct connection string → `DATABASE_URL` |
| **Railway** | Express API | Root dir `/backend`, start command `npx prisma migrate deploy && node src/index.js`, health check `/health` |
| **Vercel** | React frontend | Root dir `frontend`, env `VITE_API_URL`, SPA rewrite in `vercel.json` |

Deploy order: **database → backend → frontend**, then set the backend's `FRONTEND_URL` to the exact Vercel URL so CORS allows it.

## 🗺️ Roadmap

- [x] Register and login with bcrypt and JWT
- [x] Protected notes CRUD with ownership checks
- [x] React UI with route guards
- [x] Production deployment
- [ ] `httpOnly` cookie auth
- [ ] Automated tests (Vitest and Supertest), including "user B can't read user A's notes"
- [ ] Password reset by email
- [ ] Search and pagination
- [ ] GitHub Actions CI

## 🧠 What I learned

- How a browser and API talk over REST and JSON, including CORS between separate domains
- Why passwords are hashed (not encrypted) and how bcrypt cost factors work
- Authentication vs. authorization, and how one missing `userId` filter becomes an IDOR bug
- Prisma schemas and migrations, and running them safely in production
- Deploying a three-service stack with environment-based configuration

## 🤝 Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.

## 📄 License

Released under the [MIT License](./LICENSE).

---

<div align="center">

**If this project helped you, consider giving it a ⭐**

Built by [YOUR NAME](https://github.com/YOUR-USERNAME)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,18&height=100&section=footer" width="100%" alt="" />

</div>