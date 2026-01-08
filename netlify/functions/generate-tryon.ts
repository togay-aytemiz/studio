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
    Role: Expert Virtual Try-On AI.
    
    Task: Generate a photorealistic virtual try-on image based on the provided inputs.

    Inputs:
    1. Garment Image: The clothing item to apply.
    2. User Body Photo: Defines the target body shape and pose.
    3. User Face Photo: Defines the identity.

    STRICT GUIDELINES:

    1. COMPOSITION & POSE:
       - Subject: User's face and full body must be clearly visible from head to toe.
       - Pose: Natural standing pose, arms in a relaxed position.
       - Identity: STRICTLY preserve the identity from the Face Photo.
       - Body Shape: STRICTLY preserve the user's original body shape and proportions.

    2. GARMENT APPLICATION & STYLING (MANDATORY OUTFIT HARMONY):
       - PRIMARY TASK: Replace the target clothing on the Body Photo with the Garment Image.
       - CRITICAL STYLING RULE: You are a high-end fashion stylist. DO NOT preserve the original accompanying clothes if they look bad or clashing.
         - If the user wears a Jacket/Top: You MUST change the trousers/skirt and shoes if the original ones does not match the style/color of the new Jacket.
         - REPLACE mismatched items with high-quality, neutral, or matching designer pieces.
         - EXAMPLE: If trying on a tuxedo jacket, REMOVE jeans/shorts and GENERATE matching tuxedo trousers.
         - EXAMPLE: If trying on a summer dress, REMOVE sneakers and GENERATE sandals or heels.
         - Goal: A 100% cohesive, runway-ready look. If in doubt, REPLACE the accompanying items to match perfectly.
       - Ensure natural fabric drape, tension points, and realistic wrinkles/folds.
       - Handle occlusions: Hair and arms/hands must properly overlap the garment if they did so in the original pose.

    3. CRITICAL: BACKGROUND & LIGHTING (MUST REPLACE ORIGINAL):
       - BACKGROUND: COMPLETELY REMOVE the original background. REPLACE it with a high-end, clean, OFF-WHITE STUDIO WALL.
       - The background must be solid off-white/light gray (e.g., #F5F5F5). 
       - FLOORING: Matching studio floor with soft contact shadows.
       - LIGHTING: Soft, diffused studio lighting. No harsh shadows.
       - DO NOT preserve the original street/room background.

    4. QUALITY & STYLE:
       - Result must be e-commerce compliant, photorealistic, and trustworthy.
       - High resolution, clean edges (no halos).
       - Garment color must match the product reference.

    NEGATIVE PROMPT (AVOID):
    - Original background, street background, outdoor background, busy background, complex background.
    - Dark background, colored background, patterned background.
    - Cropped body, missing feet, awkward poses, stiff arms.
    - Face distortion, body reshaping.
    - Artificial lighting effects, lens flares, hard shadows.
    - Low quality, blurry, pixelated, bad anatomy, distorted hands, extra limbs.
    
    ${description ? `Additional Product Context: ${description}` : ''}
        `;

        console.log("Generating content with Gemini...");

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: 'image/jpeg', data: garmentData } },
                    { inlineData: { mimeType: 'image/jpeg', data: bodyData } },
                    { inlineData: { mimeType: 'image/jpeg', data: faceData } }
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
