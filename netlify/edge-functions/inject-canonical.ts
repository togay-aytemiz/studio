import type { Context } from "@netlify/edge-functions";

const BASE_URL = "https://www.agens.studio";

export default async function handler(request: Request, context: Context) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Skip static assets and API routes before reading the response body.
    if (
        pathname.startsWith("/assets/") ||
        pathname.startsWith("/.netlify/") ||
        pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|eot)$/)
    ) {
        return context.next();
    }

    const response = await context.next();
    const contentType = response.headers.get("content-type") || "";

    // Only process HTML responses
    if (!contentType.includes("text/html")) {
        return response;
    }

    const responseClone = response.clone();

    try {
        let html = await response.text();

    // Determine canonical URL (normalize trailing slashes)
    const normalizedPath = pathname === "/" ? "" : pathname.replace(/\/$/, "");
    const canonicalUrl = `${BASE_URL}${normalizedPath}`;

    // Determine language
    const isEnglish = pathname.startsWith("/en");
    const lang = isEnglish ? "en" : "tr";
    const ogLocale = isEnglish ? "en_US" : "tr_TR";

    // Update html lang attribute
    html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${lang}"`);

    // Update canonical tag
    html = html.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${canonicalUrl}"/>`
    );

    // Update og:url meta tag
    html = html.replace(
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:url" content="${canonicalUrl}"/>`
    );

    // Update og:locale meta tag
    html = html.replace(
        /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:locale" content="${ogLocale}"/>`
    );

        const headers = new Headers(response.headers);
        headers.delete("content-length");
        headers.delete("content-encoding");
        headers.delete("etag");

        return new Response(html, {
            status: response.status,
            headers,
        });
    } catch (error) {
        console.error("inject-canonical error:", error);
        return responseClone;
    }
}
