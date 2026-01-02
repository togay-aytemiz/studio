import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateProjectBrief = async (userIdea: string): Promise<string> => {
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`## AI Strategy Analysis for: "${userIdea}"\n\n**Core Value Proposition:**\nA streamlined solution focusing on efficiency and user engagement.\n\n**Recommended Tech Stack:**\n- Frontend: React or React Native\n- Backend: Node.js (Scalable)\n- Database: PostgreSQL\n\n**Key MVP Features:**\n1. User Authentication\n2. Real-time Dashboard\n3. automated reporting\n\n*Note: Add your API Key to enable real-time AI analysis.*`);
      }, 1500);
    });
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Sen üst düzey bir yazılım stüdyosunun Yapay Zeka yöneticisisin.
      Potansiyel bir müşteri şu fikri gönderdi: "${userIdea}".
      Kısa, profesyonel ve cesaret verici bir "İlk Bakış" özeti oluştur (Max 150 kelime).
      Türkçe yanıt ver.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Özet oluşturulamadı.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI servisimiz şu an yoğun. Lütfen formu gönderin, detayları görüşelim.";
  }
};

export const analyzeProductIdea = async (idea: string): Promise<string> => {
  // Mock response for when API key is missing
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          feasibilityScore: 88,
          viabilityVerdict: "Bu proje teknik olarak son derece uygulanabilir ancak veri tutarlılığı kritik rol oynayacak.",
          complexity: {
            frontend: 45,
            backend: 85,
            ai: 60
          },
          technicalChallenges: [
            "Yüksek anlık trafik için WebSocket optimizasyonu gerekecek.",
            "KVKK/GDPR uyumluluğu için veri şifreleme katmanı kritik.",
            "Mikroservis mimarisi kurulmazsa ileride teknik borç oluşabilir."
          ],
          recommendedStack: {
            frontend: "Next.js + Tailwind (Web) / React Native (Mobil)",
            backend: "Node.js (NestJS) veya Go",
            infrastructure: "AWS Serverless + Supabase"
          },
          mvpTimeline: "10-14 Hafta",
          monetizationStrategy: "Freemium model ile başlayıp, gelişmiş analitik raporlarını Enterprise paketine koyarak B2B satışa odaklanmalısınız.",
          agensInsight: "Yönetim paneline odaklanmadan önce, son kullanıcının 'aha!' anını yaşadığı ana akışı mükemmelleştirin. İlk versiyonda admin paneli manuel olabilir."
        };
        resolve(JSON.stringify(mockData));
      }, 2500);
    });
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Sen "Agens AI", premium bir yazılım stüdyosunun Dijital CTO'susun (Chief Technology Officer).
      Bu ürün fikrini analiz et: "${idea}".
      
      Çıktıyı tamamen Türkçe olarak ve aşağıdaki JSON formatında ver.
      Tonun: Profesyonel, teknik açıdan derinlikli, hafif fütüristik ama gerçekçi. Seni bir insan değil, çok zeki bir makine olarak görsünler.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feasibilityScore: { type: Type.NUMBER, description: "0-100 arası teknik uygulanabilirlik puanı." },
            viabilityVerdict: { type: Type.STRING, description: "Teknik durumu özetleyen tek cümlelik net bir tespit." },
            complexity: {
              type: Type.OBJECT,
              properties: {
                frontend: { type: Type.NUMBER, description: "0-100 arası frontend karmaşıklığı" },
                backend: { type: Type.NUMBER, description: "0-100 arası backend karmaşıklığı" },
                ai: { type: Type.NUMBER, description: "0-100 arası AI/Veri karmaşıklığı" }
              }
            },
            technicalChallenges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 adet kritik teknik zorluk veya risk."
            },
            recommendedStack: {
              type: Type.OBJECT,
              properties: {
                frontend: { type: Type.STRING },
                backend: { type: Type.STRING },
                infrastructure: { type: Type.STRING }
              }
            },
            mvpTimeline: { type: Type.STRING, description: "Tahmini MVP süresi (örn: 8-12 Hafta)" },
            monetizationStrategy: { type: Type.STRING, description: "Bu ürün için en mantıklı gelir modeli önerisi (tek cümle)." },
            agensInsight: { type: Type.STRING, description: "Projeyi başarıya götürecek, ezber bozan stratejik bir tavsiye." }
          },
          required: ["feasibilityScore", "viabilityVerdict", "complexity", "technicalChallenges", "recommendedStack", "mvpTimeline", "monetizationStrategy", "agensInsight"]
        }
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Agens AI şu an kalibrasyon modunda. Lütfen tekrar deneyin.");
  }
};