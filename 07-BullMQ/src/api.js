import express from "express";
import { emailQueue } from "./queue.js";

// Create an Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());


// Define a route to add a welcome email job to the queue
app.post("/welcome-email", async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({
            error: "Email and name are required",
        });
    }

    const job = await emailQueue.add(
        "send-welcome-email",
        { email, name },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000, // Initial delay of 1 second
            },
        }
    );

    res.json({
        message: "Welcome email job added to the queue.",
        jobId: job.id
    });
});



// Define a simple route to check if the server is running
app.get("/", (req, res) => {
    res.json({
        message: "Welcome.",
    });
})


// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
