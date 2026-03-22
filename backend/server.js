require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", aiRoutes);

app.get("/", (req, res) => {
  res.send("AI Flow Backend is running!");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    })
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Please stop the other process first.`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); 
  });
