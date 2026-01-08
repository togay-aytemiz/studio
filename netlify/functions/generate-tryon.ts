import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const MODEL_NAME = "gemini-3-pro-image-preview";

export const handler = async (event: any) => {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle OPTIONS for CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    // API Key Validation
    const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API_KEY missing");
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error: API_KEY missing' }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { garmentImages, bodyImage, faceImage, description } = body;

        // Basic Validation
        if (!garmentImages || garmentImages.length === 0 || !bodyImage || !faceImage) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required images (garment, body, or face)' }) };
        }

        const ai = new GoogleGenAI({ apiKey });

        // Helper to clean base64
        const cleanBase64 = (str: string) => str.includes(',') ? str.split(',')[1] : str;

        const bodyData = cleanBase64(bodyImage);
        const faceData = cleanBase64(faceImage);
        // Take the first garment image as per reference logic simplification
        const garmentData = cleanBase64(garmentImages[0]);

        // Prompt from User Reference
        const prompt = `
    Role: Expert Virtual Try-On AI and Fashion Photographer.
    
    Task: Generate a photorealistic virtual try-on image based on the provided inputs.

    Inputs (in order of appearance):
    1. User Face Photo: THE MOST IMPORTANT INPUT - This is the person's identity. The output MUST have THIS EXACT FACE.
    2. Garment Image: The clothing item to apply.
    3. User Body Photo: Defines the target body shape and proportions ONLY (not the face, not the pose).

    STRICT GUIDELINES:

    1. FACE PRESERVATION (HIGHEST PRIORITY - NON-NEGOTIABLE):
       - The Face Photo is the PRIMARY identity reference. The generated face MUST be IDENTICAL to the Face Photo.
       - COPY THE EXACT FACE: Same eyes, nose, lips, face shape, skin tone, hair color, hairstyle.
       - PRESERVE FACIAL EXPRESSION: If the person is smiling in the Face Photo, they MUST smile in the output. If neutral, keep neutral.
       - NO face modification, NO beautification, NO aging, NO changing features.
       - The output person must be IMMEDIATELY RECOGNIZABLE as the same person in the Face Photo.
       - This is a virtual try-on, NOT a face swap with a model. The face must be the USER's face.

    2. COMPOSITION & POSE:
       - Full body must be clearly visible from head to toe.
       - POSE REQUIREMENT: Use a confident, fashion-forward studio pose:
         * Preferred: One hand on hip, slight body angle, confident stance
         * Alternative: Arms relaxed at sides with slight angle, model-like posture
         * The pose should look professional and dynamic, like a fashion catalog
       - Do NOT use stiff, awkward, or passport-photo-like poses.
       - Body Shape: STRICTLY preserve the user's original body shape and proportions from Body Photo.
       - Use the Body Photo ONLY for body proportions and silhouette. Do NOT copy its environment.

    3. GARMENT APPLICATION & STYLING (MANDATORY OUTFIT HARMONY):
       - PRIMARY TASK: Replace the target clothing on the Body Photo with the Garment Image.
       - CRITICAL STYLING RULE: You are a high-end fashion stylist. Preserve the garment identity but ensure a cohesive look.
         - PRIORITY: Keep the core outfit from the Garment Image. Only adjust other pieces if there is a clear clash in color or formality.
         - ACCESSORY-FIRST: Prefer adding or updating accessories (shoes, bag, belt, jewelry) before replacing core garments.
         - CONTROLLED REPLACEMENT: Replace trousers/skirt/top only when the mismatch is severe or category-specific rules require it.
         - CATEGORY RULES:
           - Formal/tuxedo jacket: Replace jeans/shorts with matching formal trousers; add dress shoes.
           - Dress: Replace sneakers with heels or elegant flats; keep silhouette clean.
           - Casual jacket/top: Keep original bottoms unless they strongly clash; prefer accessory updates.
         - DO NOT INVENT PROPS: No furniture/objects; only clothing and wearable accessories.
         - Goal: A cohesive, studio-ready look without resetting the entire outfit unless necessary.
       - Ensure natural fabric drape, tension points, and realistic wrinkles/folds.
       - Handle occlusions: Hair and arms/hands must properly overlap the garment if they did so in the original pose.

    4. CRITICAL: BACKGROUND & LIGHTING (MUST REPLACE ORIGINAL):
       - BACKGROUND: COMPLETELY REMOVE the original background. REPLACE it with a high-end, clean, OFF-WHITE STUDIO WALL.
       - The background must be solid off-white/light gray (e.g., #F5F5F5).
       - FLOORING: Matching studio floor with soft contact shadows.
       - LIGHTING: Soft, diffused studio lighting. No harsh shadows.
       - DO NOT preserve the original street/room background.
       - No props, no furniture, no kitchen, no room elements, no scenery.

    5. QUALITY & STYLE:
       - Result must be e-commerce compliant, photorealistic, and trustworthy.
       - High resolution, clean edges (no halos).
       - Garment color must match the product reference.
       - The result should look like a professional fashion catalog photo.

    NEGATIVE PROMPT (AVOID):
    - Different face, changed face, modified face, beautified face, different person, model face.
    - Original background, street background, outdoor background, busy background, complex background.
    - Kitchen, living room, bedroom, doors, windows, furniture, plants, appliances, decor.
    - Dark background, colored background, patterned background.
    - Stiff pose, awkward pose, passport photo pose, arms straight down.
    - Cropped body, missing feet, awkward poses.
    - Face distortion, body reshaping.
    - Artificial lighting effects, lens flares, hard shadows.
    - Low quality, blurry, pixelated, bad anatomy, distorted hands, extra limbs.
    
    FINAL REMINDER: The FACE in the output MUST be EXACTLY the same as the Face Photo input. This is the most critical requirement.
    
    ${description ? `Additional Product Context: ${description}` : ''}
        `;

        console.log("Generating content with Gemini...");

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                parts: [
                    { text: prompt },
                    // FACE FIRST - Most important for identity preservation
                    { inlineData: { mimeType: 'image/jpeg', data: faceData } },
                    { inlineData: { mimeType: 'image/jpeg', data: garmentData } },
                    { inlineData: { mimeType: 'image/jpeg', data: bodyData } }
                ]
            },
            config: {
                imageConfig: {
                    imageSize: '1K',
                    aspectRatio: '3:4'
                },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                ],
            }
        });

        // Response Handling from Reference
        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];

            // 1. Check for image
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData && part.inlineData.data) {
                        console.log("Image generated successfully.");
                        return {
                            statusCode: 200,
                            headers,
                            body: JSON.stringify({ image: `data: image / png; base64, ${part.inlineData.data} ` })
                        };
                    }
                }
            }

            // 2. Check for text refusal
            let textContent = "";
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.text) textContent += part.text;
                }
            }

            if (textContent) {
                console.warn("Model returned text instead of image:", textContent);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: `Model refused to generate image: ${textContent.substring(0, 100)}...` })
                };
            }

            // 3. Check finish reason
            if (candidate.finishReason) {
                console.warn(`Generation finished with reason: ${candidate.finishReason} `);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Safety guidelines prevented image generation. Please try a different pose or photo.' })
                };
            }
        }

        console.error("No content in response:", JSON.stringify(response));
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'No image generated. Please try again.' })
        };

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Internal Server Error' })
        };
    }
};
