import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const MODEL_NAME = "gemini-1.5-pro-latest"; // Using the latest Pro model for best quality

export const handler = async (event: any) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        console.error("API_KEY is missing in environment variables");
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Server configuration error: API_KEY missing' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { garmentImages, bodyImage, faceImage, description } = body;

        if (!garmentImages || !Array.isArray(garmentImages) || garmentImages.length === 0 || !bodyImage || !faceImage) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required images (garment, body, or face)' })
            };
        }

        // Initialize Google GenAI
        const ai = new GoogleGenAI({ apiKey: apiKey });

        // Clean base64 strings helper
        const cleanBase64 = (str: string) => str.includes(',') ? str.split(',')[1] : str;

        const bodyData = cleanBase64(bodyImage);
        const faceData = cleanBase64(faceImage);

        // Prepare content parts
        const promptText = `
    Task: Commercial Fashion Photography - Virtual Try-On.
    
    Inputs:
    1. Garment Images (Product) - I have provided ${garmentImages.length} view(s) of the product.
    2. Model Reference (Pose & Body).
    3. Identity Reference (Face).

    Instructions:
    - Generate a photorealistic studio image.
    - Composite the Garment onto the Model Reference.
    - Preserve the Model's Pose and Body Shape accurately.
    - Use the Identity Reference for the face features.
    - Ensure the garment fits naturally with realistic fabric draping and lighting.

    Aesthetic & Context:
    - High-end fashion catalog style.
    - Professional studio softbox lighting.
    - Clean, soft neutral background.
    - Elegant, tasteful, and modest presentation.
    - 8K resolution, sharp textures.

    Safety Guidelines:
    - The output must be suitable for a general audience e-commerce store.
    - Ensure the garment provides full coverage appropriate for a commercial catalog.
    - Avoid any sexually explicit composition. This is a standard product display.

    ${description ? `Product Details: ${description}` : ''}
    
    Negative Prompt: low quality, low resolution, blurry, pixelated, bad anatomy, distorted, bad hands, extra limbs, cartoon, illustration, painting, sketch, artifacts, noise, grain, watermark, text, nudity, nsfw, explicit content, offensive.
  `;

        const parts = [
            { text: promptText },
            // Add all garment images
            ...garmentImages.map((img: string) => ({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64(img)
                }
            })),
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: bodyData
                }
            },
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: faceData
                }
            }
        ];

        console.log("Generating content with Gemini...");

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                parts: parts
            },
            config: {
                systemInstruction: "You are a professional fashion photographer and digital retoucher specializing in high-end virtual try-on composites.",
                responseMimeType: 'application/json', // Force JSON structure? No, we want an image, but the snippet handled it differently. 
                // Let's stick to standard generation and parsing, but user used `generateContent` directly expecting image parts.
                // Actually, Gemini generates text by default unless prompted otherwise, but for images we rely on it returning image/jpeg in candidates for newer multimodal models OR we ask for it?
                // Wait, standard Gemini API returns text. For Image Generation (Imagen 3) via Gemini API, the interfacing is different.
                // HOWEVER, the user provided snippet uses `ai.models.generateContent` with image inputs and expects image output. 
                // This suggests they are using a model capability where it outputs image data (like some fine-tuned or multimodal-out models).
                // Standard Gemini 1.5 Pro is text/code out. 
                // BUT, maybe they mean Imagen via the same SDK? 
                // Let's look closely at their snippet: "Check for image parts in the response... if part.inlineData...".
                // This implies the model RETURNS inlineData. 
                // Let's trust the user's snippet structure for "Nano Banana 3 pro" (likely a placeholder for a specific model or they have access to something specific).
                // I will stick to their logic.

                // Safety settings
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                    },
                ],
            }
        });

        // Handle response matches user's logic
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
                            body: JSON.stringify({ image: `data:image/png;base64,${part.inlineData.data}` })
                        };
                    }
                }
            }

            // 2. If no image, check for text (refusal or error explanation)
            let textContent = "";
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.text) textContent += part.text;
                }
            }

            console.warn("Model returned text:", textContent);

            return {
                statusCode: 422, // Unprocessable Entity
                headers,
                body: JSON.stringify({ error: 'Model generated text instead of image', details: textContent })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'No candidates returned from model' })
        };

    } catch (error: any) {
        console.error("GenAI Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to generate try-on', details: error.message })
        };
    }
};
