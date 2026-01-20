import { connectLambda, getStore } from "@netlify/blobs";

const STORE_NAME = "tryon-jobs";

export const handler = async (event: any) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    let jobId = event.queryStringParameters?.jobId;
    if (!jobId && event.httpMethod === "POST") {
        try {
            const body = JSON.parse(event.body || "{}");
            jobId = body.jobId;
        } catch (error) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
        }
    }

    if (!jobId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing jobId" }) };
    }

    if (event?.blobs) {
        connectLambda(event);
    }

    const store = getStore(STORE_NAME);
    const job: any = await store.getJSON(jobId);
    if (!job) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Job not found" }) };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            status: job.status,
            image: job.image,
            error: job.error,
            updatedAt: job.updatedAt,
        }),
    };
};
