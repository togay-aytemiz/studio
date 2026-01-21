const API_BASE_URL = process.env.TRYON_API_BASE_URL || "https://tryon-api-production-657d.up.railway.app";

const buildHeaders = () => ({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
});

export const handler = async (event: any) => {
    const headers = buildHeaders();

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    const apiKey = process.env.TRYON_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Server configuration error: TRYON_API_KEY missing" }) };
    }

    const contentType = event.headers?.["content-type"] || event.headers?.["Content-Type"] || "";
    if (!contentType.includes("multipart/form-data")) {
        return { statusCode: 415, headers, body: JSON.stringify({ error: "Content-Type must be multipart/form-data" }) };
    }

    if (!event.body) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing multipart body" }) };
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/try-on`, {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "content-type": contentType,
            },
            body: body as BodyInit,
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
