import express from "express";
import Redis from "ioredis";

// Create an Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());


// Create a Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


// Define a constant for the leaderboard key in Redis
const LEADERBOARD_KEY = "leaderboard:scores";


// Define a route to increment the view count for a post
app.post("/post/:id/view", async (req, res) => {
    const postId = req.params.id;

    // Increment the view count for the post in Redis
    const viewCnt = await redis.incr(`post:${postId}:views`);

    res.json({
        postId,
        viewCount: viewCnt,
    });
});

// Define a route to update the score for a user in the leaderboard
app.post("/leaderboard/score", async (req, res) => {
    const { userId, score } = req.body;

    if (!userId || typeof score !== "number") {
        return res.status(400).json({
            error: "userId and score are required, and score must be a number",
        });
    }

    await redis.zincrby(LEADERBOARD_KEY, score, userId);

    res.json({
        message: `Score for user ${userId} updated by ${score}`,
    });
});


// Define a route to get the top 10 users from the leaderboard
app.get("/leaderboard", async (req, res) => {
    // Get the top 10 users from the leaderboard
    await redis.zrevrange(LEADERBOARD_KEY, 0, 10, "WITHSCORES", (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve leaderboard",
            });
        }
        res.json({
            leaderboard: result,
        });
    })
});


// Define a route to get the rank of a user
app.get("leaderboard/:userId/rank", async (req, res) => {
    await redis.zrevrank(LEADERBOARD_KEY, userId, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Failed to retrieve leaderboard",
            });
        }
        res.json({
            user: userId,
            rank: result,
        });
    })
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
