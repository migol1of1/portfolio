require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(uri);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Schema and model
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// 🔧 Improved form submission route with header/content validation
app.post("/submit", async (req, res) => {
  try {
    // Check if content type is application/json
    const isJson = req.headers["content-type"]?.includes("application/json");

    const { name, email, message } = isJson
      ? req.body
      : {
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
        };

    // Check for missing fields
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(200).json({ success: true, message: "Message saved!" });
  } catch (error) {
    console.error("❌ Error saving message:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Optional: MongoDB test insert
const testSchema = new mongoose.Schema({ message: String });
const Test = mongoose.model("Test", testSchema);

Test.create({ message: "Connection successful!" })
  .then(() => console.log("✅ Test insert successful."))
  .catch((err) => console.error("❌ Test insert failed:", err));

app.get("/ping", (_, res) => {
  res.send("OK");
});
// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
