import Redis from "ioredis";

// Create a Redis subscriber client
const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


subscriber.subscribe("notifications", (err) => {
    if (err) {
        console.error("Failed to subscribe: %s", err.message);
        return;
    }
    console.log("Subscribed successfullly to notifications channel");
});

subscriber.on("message", (channel, message) => {
    console.log("Received on channel ", channel, ":", JSON.parse(message));
}); 
