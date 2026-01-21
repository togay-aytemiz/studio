const API_BASE_URL = process.env.TRYON_API_BASE_URL || "https://tryon-api-production-657d.up.railway.app";

const buildHeaders = () => ({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
});

const parseDataUrl = (value: string, fallbackType: string = "image/jpeg") => {
    const trimmed = value.trim();
    const match = trimmed.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
        return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
    }
    return { mimeType: fallbackType, buffer: Buffer.from(trimmed, "base64") };
};

const extensionFromMime = (mimeType: string) => {
    switch (mimeType) {
        case "image/png":
            return ".png";
        case "image/webp":
            return ".webp";
        case "image/jpeg":
        case "image/jpg":
            return ".jpg";
        default:
            return ".jpg";
    }
};

const createBlob = (dataUrl: string, name: string) => {
    const { mimeType, buffer } = parseDataUrl(dataUrl);
    const filename = `${name}${extensionFromMime(mimeType)}`;
    return { blob: new Blob([buffer], { type: mimeType }), filename };
};

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
    if (contentType.includes("multipart/form-data")) {
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
    }

    let payload: any;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch (error) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
    }

    const garmentImages = Array.isArray(payload?.garmentImages) ? payload.garmentImages : [];
    const garmentImage = typeof payload?.garmentImage === "string" ? payload.garmentImage : "";
    const garmentUrl =
        typeof payload?.garment_url === "string"
            ? payload.garment_url
            : typeof payload?.garmentUrl === "string"
                ? payload.garmentUrl
                : "";
    const bodyImage = typeof payload?.bodyImage === "string" ? payload.bodyImage : "";
    const faceImage = typeof payload?.faceImage === "string" ? payload.faceImage : "";

    if (!bodyImage || (!garmentImages.length && !garmentImage && !garmentUrl)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Missing required images (garment or garment_url, and body)." }),
        };
    }

    const form = new FormData();

    if (garmentImages.length || garmentImage) {
        const source = garmentImages[0] || garmentImage;
        const { blob, filename } = createBlob(source, "garment");
        form.append("garment", blob, filename);
    } else if (garmentUrl) {
        form.append("garment_url", garmentUrl);
    }

    const { blob: bodyBlob, filename: bodyFilename } = createBlob(bodyImage, "body");
    form.append("body", bodyBlob, bodyFilename);

    if (faceImage) {
        const { blob: faceBlob, filename: faceFilename } = createBlob(faceImage, "face");
        form.append("face", faceBlob, faceFilename);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/try-on`, {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
            },
            body: form,
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
