# REDIS Learning

Hands-on Redis learning playground inspired by [Chai aur Code](https://www.youtube.com/@chaiaurcode) — practical Node.js examples and exercises.

## Purpose

This repository is built to learn Redis through small, focused examples and experiments following the "[Chai aur Code](https://www.youtube.com/@chaiaurcode)" REDIS tutorials. Each numbered folder contains a self-contained example demonstrating a Redis pattern or feature (caching, pub/sub, queues, TTLs, leaderboards, etc.).

## Repo structure (summary)

- `02-Local-Setup/` — connect to Redis locally and basic `ioredis` usage
- `03-Site-Banner/` — cache-driven site banner example (in-memory → Redis)
- `04-Login-OTP-Verification-TTL/` — OTP generation and TTL-based verification patterns
- `05-User-Profile-cache-json-vs-hash/` — compare storing user profiles as JSON vs Redis hashes
- `06-Email-Queue/` — simple email job queue implemented with Redis lists
- `07-BullMQ/` — BullMQ examples: producer (`api.js`), queue (`queue.js`), worker (`worker.js`)
- `08-Pub-Sub-using-redis/` — publisher/subscriber demo (`api.js`, `subscriber.js`)
- `09-Leaderboard/` — leaderboard using Redis sorted sets (ZADD, ZRANGE)

Each numbered folder contains a small, focused example you can run independently.

## Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- Redis server (local or Docker)

You can run Redis locally with Docker:

```bash
docker run --name redis -p 6379:6379 -d redis:7
```

## Quick start — run an example

From repository root, choose an example folder and run:

```bash
cd 07-BullMQ
npm install
node index.js
```

Adjust the entrypoint file (`index.js`, `api.js`, or `worker.js`) per example.

## Learning goals

- Understand Redis data types (strings, hashes, lists, sets, sorted sets)
- Use Redis for caching and TTL-based storage
- Implement pub/sub patterns with Redis
- Build job queues with Bull/BullMQ backed by Redis
- Explore data models for leaderboards and analytics

## Credits

Inspired by [Chai aur Code](https://www.youtube.com/@chaiaurcode) — used as the learning source and guide.
