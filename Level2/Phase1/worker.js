import { Worker } from "bullmq";
import sendEmail from "./lib/sendEmail.js";
import Redis from "ioredis";

const connection = new Redis("redis://localhost:6379", {
    maxRetriesPerRequest: null
})

const worker = new Worker("emailQueue", (job)=>{

    console.log("Job Started");

    const email = job.data.email;
    sendEmail(email)

    console.log("Job completed");
}, {connection})