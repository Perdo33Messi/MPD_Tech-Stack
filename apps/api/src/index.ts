import express from "express";
import cors from "cors";
import { createApiKey, isValidApiKey } from "./apiKeys";

const app = express();
app.use(cors());
app.use(express.json());

// Middleware: require API key for everything except /generate-key
app.use((req, res, next) => {
 if (req.path === "/generate-key") return next();

 const key = req.header("x-api-key");
 if (!isValidApiKey(key)) {
   return res.status(401).json({ error: "Invalid or missing API key" });
 }

 next();
});

// Protected route
app.get("/hello", (req, res) => {
 res.json({ message: "Hello from the hashed in-memory API!" });
});

// Public endpoint to generate a key
app.post("/generate-key", (req, res) => {
 const newKey = createApiKey();
 res.json({ apiKey: newKey });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API running on port ${port}`));

