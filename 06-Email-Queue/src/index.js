import express from "express";
import Redis from "ioredis";

// Create an Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());


// Create a Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


// Define a constant for the Redis key used to store the email queue
const QUEUE_KEY = "queue:emails";


// Define a route to enqueue an email job
app.post("/emails", async (req, res) => {
    const { email } = req.body;
    const subject = req.body.subject;
    const body = req.body.body;

    if (!email) {
        return res.status(400).json({
            error: "Email is required",
        });
    }

    const job = {
        to: email,
        subject: subject || "No Subject",
        body: body || "No Body",
        createdAt: new Date().toISOString(),
    }

    await redis.lpush(QUEUE_KEY, JSON.stringify(job));

    res.json({
        queued: true,
        job,
    });
});


// Define a route to process one email job from the queue
app.get("/emails/process-one", async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);
    if (!rawJob) {
        return res.json({
            message: "No jobs in the queue",
        });
    }

    const job = JSON.parse(rawJob);
    // Simulate sending the email (in a real application, you would integrate with an email service)
    console.log(`Sending email to ${job.to} with subject "${job.subject}" and body "${job.body}"`);

    res.json({
        message: "Email sent",
        processed: true,
        job,
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
