const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(express.json());
app.use(cors());

// Helper: Read data from file
const readData = () => {
    try {
        const raw = fs.readFileSync(DATA_FILE);
        return JSON.parse(raw);
    } catch (err) {
        return [];
    }
};

// Helper: Write data to file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 1 GET all feedbacks
app.get("/api/feedbacks", (req, res) => {
    const feedbacks = readData();
    res.json({ status: "success", feedbacks });
});

// 2 GET feedback count
app.get("/api/feedbacks/count", (req, res) => {
    const feedbacks = readData();
    res.json({ status: "success", count: feedbacks.length });
});

// 3 POST new feedback
app.post("/api/feedbacks", (req, res) => {
    const { name, message } = req.body;

    if (!name?.trim() || !message?.trim()) {
        return res.status(400).json({ status: "error", message: "Name and message are required" });
    }

    const feedbacks = readData();
    const newFeedback = {
        id: feedbacks.length ? feedbacks[feedbacks.length - 1].id + 1 : 1,
        name: name.trim(),
        message: message.trim()
    };

    feedbacks.push(newFeedback);
    writeData(feedbacks);

    res.status(201).json({ status: "success", feedback: newFeedback });
});

// 4️⃣ DELETE single feedback
app.delete("/api/feedbacks/:id", (req, res) => {
    const feedbacks = readData();
    const id = parseInt(req.params.id);
    const updated = feedbacks.filter(f => f.id !== id);

    if (updated.length === feedbacks.length) {
        return res.status(404).json({ status: "error", message: "Feedback not found" });
    }

    writeData(updated);
    res.json({ status: "success", deletedId: id });
});

// 5️⃣ DELETE all feedbacks
app.delete("/api/feedbacks", (req, res) => {
    writeData([]);
    res.json({ status: "success", message: "All feedbacks cleared" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
    res.send("API is running");
  });
  