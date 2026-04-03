# Smart Resource Allocation Platform

A full-stack web application that intelligently matches volunteers to tasks based on **skills**, **distance**, and **priority** using a weighted scoring algorithm.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socketdotio)

---

## Features

- 🔐 **JWT Authentication** — Admin & Volunteer roles with secure password hashing
- 📋 **Task Management** — Full CRUD with urgency levels (Low/Medium/High)
- 🧠 **Smart Matching Engine** — Weighted scoring: skills (50%), distance (30%), availability (20%)
- 🗺️ **Interactive Map** — Leaflet + OpenStreetMap with custom markers
- 🔔 **Real-Time Notifications** — Socket.io push when tasks are assigned/completed
- 📊 **Admin Dashboard** — Stats cards, pie charts, recent assignments table
- 📱 **Responsive UI** — Mobile-first design with Tailwind CSS + glassmorphism

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS v3  |
| Backend    | Node.js + Express                   |
| Database   | MongoDB + Mongoose                  |
| Realtime   | Socket.io                           |
| Maps       | Leaflet + OpenStreetMap             |
| Charts     | Recharts                            |
| Auth       | JWT + bcryptjs                      |

---

## Smart Matching Algorithm

```
Score = (0.5 × skillMatch) + (0.3 × distanceScore) + (0.2 × availabilityScore)

skillMatch      = matched_skills / required_skills           → [0, 1]
distanceScore   = 1 / (1 + distance_km / 10)                → (0, 1]
availabilityScore = available ? 1 : 0

Urgency Multiplier:
  High   → ×1.5
  Medium → ×1.2
  Low    → ×1.0

Final score normalized to 0–100. Top-scoring volunteer is assigned.
```

---

## Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** running locally on port `27017` — [Download](https://www.mongodb.com/try/download/community)
  - Or use [MongoDB Atlas](https://www.mongodb.com/atlas) and update `MONGODB_URI` in `.env`

---

## Quick Start

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Backend `.env` file (already created with defaults):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-resource
JWT_SECRET=dev-secret-key-change-in-production-abc123xyz
```

Frontend `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **1 Admin**: `admin@demo.com` / `admin123`
- **5 Volunteers**: `alice@demo.com`, `bob@demo.com`, `carol@demo.com`, `dave@demo.com`, `eve@demo.com` — password: `volunteer123`
- **6 Sample Tasks** with different urgency levels and required skills

### 4. Run the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint                 | Auth | Role      | Description              |
|--------|--------------------------|------|-----------|--------------------------|
| POST   | `/api/auth/register`     | —    | —         | Register user            |
| POST   | `/api/auth/login`        | —    | —         | Login, returns JWT       |
| GET    | `/api/auth/me`           | ✓    | any       | Get current user         |
| GET    | `/api/volunteers`        | ✓    | admin     | List all volunteers      |
| GET    | `/api/volunteers/:id`    | ✓    | any       | Volunteer details        |
| PUT    | `/api/volunteers/profile`| ✓    | volunteer | Update profile           |
| GET    | `/api/volunteers/dashboard`| ✓  | volunteer | Assigned tasks           |
| POST   | `/api/tasks`             | ✓    | admin     | Create task              |
| GET    | `/api/tasks`             | ✓    | any       | List all tasks           |
| GET    | `/api/tasks/:id`         | ✓    | any       | Task details             |
| PUT    | `/api/tasks/:id`         | ✓    | admin     | Update task              |
| DELETE | `/api/tasks/:id`         | ✓    | admin     | Delete task              |
| PATCH  | `/api/tasks/:id/complete`| ✓    | volunteer | Mark task complete       |
| POST   | `/api/assign/auto`       | ✓    | admin     | Auto-match & assign      |
| POST   | `/api/assign/manual`     | ✓    | admin     | Manual assign            |
| GET    | `/api/assign/overview`   | ✓    | admin     | Dashboard stats          |

---

## Project Structure

```
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── middleware/auth.js         # JWT middleware & role guards
│   ├── models/
│   │   ├── User.js               # User schema (admin + volunteer)
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── volunteers.js         # Volunteer routes
│   │   ├── tasks.js              # Task CRUD routes
│   │   └── assign.js             # Assignment & matching routes
│   ├── utils/
│   │   ├── matchingEngine.js     # Smart matching algorithm
│   │   └── socket.js             # Socket.io setup
│   ├── seed.js                   # Database seed script
│   ├── server.js                 # Express entry point
│   └── .env                      # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # Auth & Socket context providers
│   │   ├── pages/                # Page components
│   │   ├── services/api.js       # Axios API client
│   │   ├── App.jsx               # Route definitions
│   │   ├── main.jsx              # React entry
│   │   └── index.css             # Tailwind + custom styles
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## Demo Walkthrough

1. **Login as Admin** → `admin@demo.com` / `admin123`
2. **View Dashboard** → See stats, charts, recent assignments
3. **Manage Tasks** → Create new or auto-assign existing tasks
4. **Auto-Assign** → Click "⚡ Auto-Assign" to see the matching engine in action
5. **View Map** → See all tasks and volunteers on the map
6. **Login as Volunteer** → `alice@demo.com` / `volunteer123`
7. **Check Dashboard** → See assigned tasks, toggle availability
8. **Complete Task** → Click "✅ Mark Complete" on an assigned task

---

## License

MIT
