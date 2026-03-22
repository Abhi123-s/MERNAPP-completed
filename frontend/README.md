# 🔮 AI Flow

A full-stack app where you type a prompt, send it to an AI, and see the response on a visual flow canvas.

---

## 🗂️ Project Structure

```
futureBlink/
  backend/    → Node.js + Express API server
  frontend/   → React app (Vite)
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) running locally **or** a MongoDB Atlas connection string

---

## 🚀 How to Run

You need to start **two servers** — the backend and the frontend.

### 1. Start the Backend

```bash
cd backend
npm install        # only needed the first time
npm start
```

✅ Backend will run at: `http://localhost:5000`

---

### 2. Start the Frontend

Open a **new terminal**, then:

```bash
cd frontend
npm install        # only needed the first time
npm run dev
```

✅ Frontend will run at: `http://localhost:5173`

---

## 🔑 Environment Variables

Before starting the backend, make sure `backend/.env` has your keys:

```env
MONGO_URI=mongodb://localhost:27017/aiflow
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000
```

Get a free API key at: https://openrouter.ai

---

## 🧑‍💻 How to Use

1. Open `http://localhost:5173` in your browser
2. Type a question in the **left node**
3. Click **▶ Run Flow** — the AI's answer appears in the **right node**
4. Click **💾 Save** to store the result in MongoDB
