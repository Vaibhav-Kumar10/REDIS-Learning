import express from "express";
import Redis from "ioredis";

// Create an Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());


// Create a Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Define a constant for the Redis key used to store the banner data
const BANNER_KEY = "app:banner";


// Define a route to get the banner message from Redis
app.post("/banner", async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to Chai Aur Code, Vaibhav learning Redis!");
    res.json({
        success: true,
    });
})


// Define a route to get the banner message from Redis
app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNER_KEY);
    if (!message) {
        return res.status(404).json({
            error: "Banner message not found",
        });
    }
    res.json({
        message,
    });
})


// Define a route to delete the banner message from Redis
app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({
        success: true,
    });
})


// Define a route to update the banner message in Redis
app.put("/banner", async (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.status(400).json({
            error: "Message is required",
        });
    }
    await redis.set(BANNER_KEY, message);
    res.json({
        success: true,
    });
})


// Define a route to check if the banner message exists in Redis
app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({
        // exists: exists,
        exists: Boolean(exists),
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