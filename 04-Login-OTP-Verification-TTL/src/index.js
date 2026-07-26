import express from "express";
import Redis from "ioredis";

// Create an Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());


// Create a Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


// Define a function to generate the Redis key for storing OTPs based on the phone number
function otpKey(phone) {
    return `otp:${phone}`;
}

// Define a route to request an OTP
app.post("/otp", async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({
            error: "Phone number is required",
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP in Redis with a TTL of 90 seconds
    await redis.set(otpKey(phone), otp, "EX", 90);

    res.json({
        message: `OTP sent to ${phone}`,
        otp,
        // In a real application, we would send the OTP via SMS or email instead of returning it in the response
    });
})


// Define a route to verify the OTP
app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    const savedOTP = await redis.get(otpKey(phone));
    if (!savedOTP) {
        return res.status(400).json({
            error: "OTP expired or not found. Please request a new OTP.",
        });
    }
    if (savedOTP != otp) {
        return res.status(400).json({
            error: "Invalid OTP. Please try again.",
        });
    }

    // OTP is valid, delete it from Redis to prevent reuse
    await redis.del(otpKey(phone));

    res.json({
        message: "OTP verified successfully!",
    });
})


// Define a route to get the TTL (time to live) of the OTP for a given phone number
app.get("/otp/:phone/ttl", async (req, res) => {
    const { phone } = req.params;

    // Get the TTL (time to live) for the OTP associated with the given phone number
    const ttl = await redis.ttl(otpKey(phone));

    res.json({
        phone,
        ttl,
    });
})


// Define a simple route to check if the server is running
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the OTP verification service. Use POST /otp to request an OTP and POST /otp/verify to verify it.",
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
