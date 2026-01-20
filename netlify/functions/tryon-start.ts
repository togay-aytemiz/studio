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

    const host = event.headers?.host;
    const proto = event.headers?.["x-forwarded-proto"] || "https";
    if (host) {
        const url = `${proto}://${host}/.netlify/functions/tryon-generate-background?jobId=${jobId}`;
        try {
            await fetch(url, { method: "POST" });
        } catch (error) {
            console.warn("tryon-start: background trigger failed", error);
        }
    } else {
        console.warn("tryon-start: missing host header, background job not triggered");
    }

    return {
        statusCode: 202,
        headers,
        body: JSON.stringify({ jobId }),
    };
};
