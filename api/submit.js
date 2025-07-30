require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

// Reuse connection in serverless context
let conn = null;
async function connectDB() {
  if (conn == null) {
    conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  }
  return conn;
}

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

let Message;
try {
  Message = mongoose.model("Message");
} catch {
  Message = mongoose.model("Message", messageSchema);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  await connectDB();

  let name, email, message;

  const isJson = req.headers["content-type"]?.includes("application/json");

  if (isJson) {
    ({ name, email, message } = req.body);
  } else {
    name = req.body.name;
    email = req.body.email;
    message = req.body.message;
  }

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    return res.status(200).json({ success: true, message: "Message saved!" });
  } catch (error) {
    console.error("❌ Error saving message:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
