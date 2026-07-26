import express from "express";
import Redis from "ioredis";

// Create an Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());


// Create a Redis publisher client
const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


// Define a route to publish notifications to the "notifications" channel
app.post("/notifications", async (req, res) => {
    // Create a payload for the notification
    const payload = {
        title: req.body.title || "Default Title",
        createdAt: new Date().toISOString(),
    };

    // Publish the notification to the "notifications" channel
    const receivers = await publisher.publish("notifications", JSON.stringify(payload))

    res.json({
        message: `Notification sent to ${receivers} subscribers.`,
        payload,
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
