# LeadFlow — Sales CRM

A full-stack Lead Management application built with React, Node.js/Express, and MongoDB, featuring an AI-powered notes summarization feature using the Anthropic API.

---

## Live Demo

https://project-r394i-hog958qvi-faizan7.vercel.app/

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS v3     |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB with Mongoose               |
| Auth      | JWT    |
| AI        | Groq  |

---

## Features

- **Authentication** — Register/login with JWT cookie-based sessions
- **Lead Management** — Create, view, update, delete leads
- **Lead Status** — New → Contacted → Qualified → Closed
- **Notes / Activity** — Add chronological notes per lead, delete notes
- **Search & Filter** — Real-time search by name/email, filter by status
- **AI Summary** — Generate AI summary of lead notes using Claude; editable before saving
- **Dashboard** — Live stats and pipeline breakdown

---

## Project Structure

```
leadflow/
├── backend/
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── lib/               # DB connection
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/    # Sidebar
│   │   ├── lib/           # Axios instance, AuthContext
│   │   └── pages/         # Dashboard, Leads, LeadDetail, AddLead, AuthPage
│   └── index.html
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- Anthropic API key

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL if your backend runs on a different port
npm run dev
```

App will be available at `http://localhost:5173`

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/leadflow
JWT_SECRET=your_super_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

### Auth
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| POST   | /api/auth/register | Register          |
| POST   | /api/auth/login    | Login             |
| POST   | /api/auth/logout   | Logout            |
| GET    | /api/auth/me       | Get current user  |

### Leads (all protected)
| Method | Endpoint                        | Description      |
|--------|---------------------------------|------------------|
| POST   | /api/leads                      | Create lead      |
| GET    | /api/leads?search=&status=      | Get all leads    |
| GET    | /api/leads/:id                  | Get lead + notes |
| PATCH  | /api/leads/:id                  | Update lead      |
| DELETE | /api/leads/:id                  | Delete lead      |
| POST   | /api/leads/:id/notes            | Add note         |
| DELETE | /api/leads/:id/notes/:noteId    | Delete note      |

### AI (protected)
| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | /api/ai/summarize | Summarize lead notes  |

---

## Architecture Overview

- Backend follows MVC pattern (routes → controllers → models)
- AI logic is isolated in its own controller and route, separate from core lead logic
- Frontend uses React Context for auth state; no external state library
- JWT stored in HTTP-only cookies for security
- Each user only sees their own leads (userId scoped queries)

---

## Assumptions & Trade-offs

- No email verification (kept simple for the scope)
- AI summary is in-memory only — saving stores it in React state, not in the database (per requirement: user must be able to edit before saving, and not auto-saved)
- No pagination (acceptable for CRM use case at this scale)
- Tailwind v3 used for compatibility with Vite without extra config

---

## AI Usage Note

**Tools used:** Claude (Anthropic) for code assistance

**Where AI helped:**
- Scaffolding boilerplate controller patterns
- Tailwind class combinations for the design system

**Where AI output needed correction:**
- Auth middleware needed to handle cookie parsing order before route registration
- Mongoose `findByIdAndUpdate` needed `{ new: true }` option to return updated document
- CORS config needed `credentials: true` for cookie-based auth to work

**Modified manually:**
- All design decisions and color tokens
- Error handling flows and edge cases
- User scoping on all lead queries (security)

**Example prompt used:**
> "Write an Express controller for creating a lead with input validation. It should use Mongoose, accept name, email, company, status fields, and return proper status codes."
