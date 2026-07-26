import express from "express";
import Redis from "ioredis";

// Create an Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());


// Create a Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


// Define a function to store the user id and profile in Redis as a json string
app.post("/user/:id/json", async (req, res) => {
    const { id } = req.params;
    const userProfile = req.body;

    // Store the user profile in Redis as a JSON string
    await redis.set(`user:${id}:json`, JSON.stringify(userProfile));

    res.json({
        savedAs: "JSON",
    });
});


// Define a function to get the user profile from Redis as a json string
app.get("/user/:id/json", async (req, res) => {
    const { id } = req.params;

    // Retrieve the user profile from Redis
    const raw = await redis.get(`user:${id}:json`);

    res.json({
        user: raw ? JSON.parse(raw) : null,
    });
});


// Define a function to store the user id and profile in Redis as a hash
app.post("/user/:id/hash", async (req, res) => {
    const { id } = req.params;
    const userProfile = req.body;

    // Store the user profile in Redis as a hash
    await redis.hset(`user:${id}:hash`, userProfile);

    res.json({
        savedAs: "Hash",
    });
});


// Define a function to get the user profile from Redis as a hash
app.get("/user/:id/hash", async (req, res) => {
    const { id } = req.params;

    // Retrieve the user profile from Redis as a hash
    const userProfile = await redis.hgetall(`user:${id}:hash`);

    res.json({
        user: userProfile,
    });
});


// Define a simple route to check if the server is running
app.get("/", (req, res) => {
    res.json({
        message: "Welcome.",
    });
})


// Define a route to test the Redis connection
app.get("/redis", async (req, res) => {
    // Test Redis connection
    const reply = await redis.ping();
    res.json({
        redis: reply,
    });
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
