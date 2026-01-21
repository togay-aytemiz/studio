const API_BASE_URL = process.env.TRYON_API_BASE_URL || "https://tryon-api-production-657d.up.railway.app";

const buildHeaders = () => ({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
});

export const handler = async (event: any) => {
    const headers = buildHeaders();

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const apiKey = process.env.TRYON_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Server configuration error: TRYON_API_KEY missing" }) };
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

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/try-on/status/${encodeURIComponent(jobId)}`, {
            method: "GET",
            headers: {
                "x-api-key": apiKey,
            },
        });

        const responseText = await response.text();
        return {
            statusCode: response.status,
            headers,
            body: responseText,
        };
    } catch (error: any) {
        return {
            statusCode: 502,
            headers,
            body: JSON.stringify({ error: error?.message || "Upstream request failed" }),
        };
    }
};
