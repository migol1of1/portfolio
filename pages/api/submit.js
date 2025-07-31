import mongoose from "mongoose";

// ✅ ENV check
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

// ✅ Cache DB connection
let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

// ✅ Schema and Model
const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: {
    type: Date,
    default: () => new Date(Date.now() + 8 * 60 * 60 * 1000), // +8 GMT
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

// ✅ Handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "DB connection failed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    await Message.create({ name, email, message });
    res.status(200).json({ success: true, message: "Saved!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Saving failed" });
  }
}
