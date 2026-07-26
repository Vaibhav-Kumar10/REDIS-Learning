import { Worker } from 'bullmq';
import { connection } from './queue.js';

const emailWorker = new Worker(
    'emails',
    async (job) => {
        console.log(`Processing job with ID: ${job.id}, name: ${job.name}, and data: ${job.data}`);
        (await new Promise((resolve) => setTimeout(resolve, 1000))); // Simulate a delay of 1 second
        console.log("Email job completed!!", job.id, job.name, job.data);
    },
    { connection }
)

emailWorker.on('completed', (job) => {
    console.log("Job completed!!", job.id, job.name, job.data);
});

emailWorker.on('failed', (job, err) => {
    console.error("Job failed!!", job.id, job.name, job.data, err);
});
