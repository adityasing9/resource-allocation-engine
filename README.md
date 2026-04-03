<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=250&section=header&text=Smart%20Resource%20Allocation&fontSize=40&fontColor=00ffe1&animation=fadeIn&fontAlignY=35&desc=AI-powered%20Volunteer%20Matching%20Platform&descAlignY=55&descAlign=50"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?color=00FFE1&center=true&vCenter=true&lines=Smart+Matching+Engine;Real-Time+Volunteer+Coordination;AI-Inspired+Decision+System"/>
</p>

<h1 align="center">
  <font color="yellow">Smart Resource Allocation Engine</font>
</h1>

A full-stack web application that intelligently matches volunteers to tasks using a **data-driven decision engine** based on skills, distance, and priority.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?logo=socketdotio)

---

## 🧠 What This Project Does (Simple Explanation)

This project solves a real-world problem faced by NGOs and social organizations:

> **How do we efficiently assign the right volunteers to the right tasks?**

In real life:

* Community needs are scattered (food, medical help, education)
* Volunteers have different **skills**, **locations**, and **availability**
* Assignments are usually done manually → inefficient and slow

---

### 💡 Solution

This platform acts as a **smart decision-making system** that:

* Collects data about **tasks** (what is needed, where, urgency)
* Stores information about **volunteers** (skills, location, availability)
* Automatically matches volunteers to tasks using a **scoring algorithm**

---

### ⚙️ How It Works

1. **Admin creates a task**

   * Example: “Food distribution in Area A (High priority)”

2. **Volunteers have profiles**

   * Skills (medical, teaching, general help)
   * Location
   * Availability

3. **Smart Matching Engine runs**

   * Finds the best volunteer based on:

     * Skill match 🧠
     * Distance 📍
     * Availability ⏱️

4. **System assigns automatically**

   * Volunteer gets notified
   * Admin sees assignment

---

### 🎯 Goal

* Reduce manual effort
* Improve response time
* Ensure **fair and efficient resource allocation**

---

### 🧠 In One Line

> This is an **AI-inspired resource allocation system** that helps organizations make smarter, faster decisions.

---

## 🌍 Real-World Impact

* Helps NGOs respond faster to urgent needs
* Ensures no area is ignored due to poor coordination
* Optimizes volunteer usage (no over/under allocation)
* Can be extended for:

  * Disaster management 🚨
  * Healthcare outreach 🏥
  * Education programs 📚

---

## ✨ Features

* 🔐 **JWT Authentication** — Admin & Volunteer roles with secure password hashing
* 📋 **Task Management** — Full CRUD with urgency levels (Low/Medium/High)
* 🧠 **Smart Matching Engine** — Weighted scoring: skills (50%), distance (30%), availability (20%)
* 🗺️ **Interactive Map** — Leaflet + OpenStreetMap with custom markers
* 🔔 **Real-Time Notifications** — Socket.io push when tasks are assigned/completed
* 📊 **Admin Dashboard** — Stats cards, pie charts, recent assignments table
* 📱 **Responsive UI** — Mobile-first design with Tailwind CSS

---

## 🧠 Smart Matching Algorithm

```
Score = (0.5 × skillMatch) + (0.3 × distanceScore) + (0.2 × availabilityScore)

skillMatch        = matched_skills / required_skills
distanceScore     = 1 / (1 + distance_km / 10)
availabilityScore = available ? 1 : 0

Urgency Multiplier:
  High   → ×1.5
  Medium → ×1.2
  Low    → ×1.0

Final score normalized to 0–100.
Top-scoring volunteer is automatically assigned.
```

---

## 🛠️ Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend  | Node.js + Express              |
| Database | MongoDB + Mongoose             |
| Realtime | Socket.io                      |
| Maps     | Leaflet + OpenStreetMap        |
| Charts   | Recharts                       |
| Auth     | JWT + bcryptjs                 |

---

## 📁 Project Structure

```
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── volunteers.js
│   │   ├── tasks.js
│   │   └── assign.js
│   ├── utils/
│   │   ├── matchingEngine.js
│   │   └── socket.js
│   ├── seed.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```
cd backend
npm install

cd ../frontend
npm install
```

---

### 2. Configure Environment

Backend `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-resource
JWT_SECRET=your-secret-key
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

### 3. Seed Database

```
cd backend
npm run seed
```

Creates:

* Admin → [admin@demo.com](mailto:admin@demo.com) / admin123
* Volunteers → sample users
* Sample tasks

---

### 4. Run Project

```
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

Open → http://localhost:5173

---

## 🔗 API Endpoints

| Method | Endpoint         | Description |
| ------ | ---------------- | ----------- |
| POST   | /api/auth/login  | Login       |
| GET    | /api/tasks       | Get tasks   |
| POST   | /api/tasks       | Create task |
| POST   | /api/assign/auto | Auto assign |

---

## 🚀 Future Improvements

* AI-based demand prediction
* Mobile app integration
* WhatsApp/SMS alerts
* Multi-NGO collaboration system

---

## 📌 Why This Project Stands Out

* Combines **full-stack + real-world problem solving**
* Demonstrates **decision-making systems**
* Shows understanding of **optimization logic**
* Scalable into a **startup-level product**

---

## 📜 License

MIT
