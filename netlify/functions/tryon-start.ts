import { getStore } from "@netlify/blobs";

const STORE_NAME = "tryon-jobs";
const JOB_TTL_SECONDS = 60 * 60;

export const handler = async (event: any) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json; charset=utf-8",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    let payload: any;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch (error) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
    }

    const { garmentImages, bodyImage, faceImage, description } = payload || {};
    if (!garmentImages || garmentImages.length === 0 || !bodyImage || !faceImage) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Missing required images (garment, body, or face)" }),
        };
    }

    const jobId = crypto.randomUUID();
    const store = getStore(STORE_NAME);
    const job = {
        id: jobId,
        status: "queued",
        createdAt: Date.now(),
        payload: {
            garmentImages,
            bodyImage,
            faceImage,
            description,
        },
    };

    await store.setJSON(jobId, job, { ttl: JOB_TTL_SECONDS });

    return {
        statusCode: 202,
        headers,
        body: JSON.stringify({ jobId }),
    };
};
