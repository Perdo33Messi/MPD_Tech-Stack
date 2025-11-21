"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apiKeys_1 = require("./apiKeys");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const TEAM = {
    name: "Industrial MakerSpace",
    members: ["Joe", "Katy", "Malte", "Jinjun"],
};
const IMAGES = [
    { name: "Joe", data: "iVBORw0KGgo... (base64 for Joe Enno Karl Lammers.png)" },
    { name: "Katy", data: "iVBORw0KGgo... (base64 for Katy Grossmann.png)" },
    { name: "Malte", data: "iVBORw0KGgo... (base64 for Malte Oberhoff.png)" },
    { name: "Jinjun", data: "iVBORw0KGgo... (base64 for Jinjun Dong.png)" },
];
function isPublicPath(path) {
    return (path === "/generate-key" ||
        path === "/keys" ||
        path.startsWith("/keys/"));
}
// Middleware: require API key for protected routes (everything except key management)
app.use((req, res, next) => {
    if (isPublicPath(req.path))
        return next();
    const key = req.header("x-api-key");
    if (!(0, apiKeys_1.isValidApiKey)(key)) {
        return res.status(401).json({ error: "Invalid or missing API key" });
    }
    next();
});
// Protected route
app.get("/hello", (req, res) => {
    res.json({ message: "Hello from the hashed in-memory API!" });
});
app.get("/api/v1/description", (req, res) => {
    res.json({
        description: "We are team Lorax and can now also code API endpoints. 🚀",
    });
});
app.get("/api/v1/team", (req, res) => {
    res.json({ team: TEAM });
});
app.get("/api/v1/teamsize", (req, res) => {
    res.json({ size: TEAM.members.length });
});
app.get("/api/v1/images", (req, res) => {
    res.json({ images: IMAGES });
});
// Public endpoints to generate/list/delete keys (demo purposes only)
app.post("/generate-key", (req, res) => {
    const newKey = (0, apiKeys_1.createApiKey)();
    res.json(newKey);
});
app.get("/keys", (req, res) => {
    res.json({ keys: (0, apiKeys_1.listApiKeys)() });
});
app.delete("/keys/:id", (req, res) => {
    const deleted = (0, apiKeys_1.deleteApiKey)(req.params.id);
    if (!deleted)
        return res.status(404).json({ error: "Key not found" });
    res.json({ success: true });
});
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API running on port ${port}`));
