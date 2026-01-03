// OpenAI Service for AI Analysis
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
console.log("OpenAI Key Loaded:", !!OPENAI_API_KEY);

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

const callOpenAI = async (messages: OpenAIMessage[]): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages,
            temperature: 0.7,
            max_tokens: 3000,
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API hatası');
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || '{}';
};

export const analyzeProductIdeaWithOpenAI = async (idea: string): Promise<string> => {
    // Mock response for when API key is missing
    if (!OPENAI_API_KEY) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = {
                    feasibilityScore: 86,
                    viabilityVerdict: "Fikir uygulanabilir; doğru MVP kapsamı ve veri akışıyla hızlıca pazara çıkabilir.",
                    complexity: {
                        frontend: 50,
                        backend: 78,
                        ai: 55
                    },
                    technicalChallenges: [
                        "Eşzamanlı kullanıcı artışı - CDN, cache ve kuyruklama ile ölçeklenebilir akış kurun.",
                        "KVKK/GDPR uyumluluğu - veri minimizasyonu, şifreleme ve erişim loglarıyla yönetin.",
                        "Kişiselleştirme kalitesi - veri etiketleme ve A/B testleriyle modeli iteratif iyileştirin."
                    ],
                    mvpModules: [
                        "Kullanıcı Girişi / Yetkilendirme",
                        "Onboarding & Profil",
                        "Çekirdek Kullanıcı Akışı",
                        "Admin Paneli",
                        "Landing Page",
                        "Ödeme Entegrasyonu",
                        "Bildirim Sistemi (Email/SMS)",
                        "Temel Analitik ve Raporlama",
                        "Loglama & İzleme"
                    ],
                    phase2Modules: [
                        "Rol Bazlı Yetkilendirme",
                        "Gelişmiş Raporlama",
                        "A/B Test & Deney Tasarımı",
                        "Otomasyon & İş Akışları",
                        "Yedekleme ve Felaket Kurtarma"
                    ],
                    recommendedStack: {
                        frontend: ["Next.js", "Tailwind CSS"],
                        backend: ["Node.js (NestJS)", "PostgreSQL"],
                        infrastructure: ["Supabase", "Vercel", "Cloudflare", "Ödeme: Iyzico"]
                    },
                    mvpTimeline: "8-12 Hafta",
                    executiveSummary: "Önce çekirdek akışı netleştirip MVP'yi hızla pazara çıkarmak, ilk gelir ve geri bildirimi 4-6 hafta içinde toplamayı sağlar. Doğru veri akışı ve basit otomasyonlarla bu fikir hızla ölçeklenebilir.",
                    competitionDensity: { label: "Orta", score: 55 },
                    userDemand: { label: "Yüksek", score: 78 },
                    marketAnalysis: "### 📊 Pazar Büyüklüğü ve Trendler\nBu dikeyde rekabet **orta seviyede** ve çözüm kalitesi farklılaştırıcı.\n\n### 🎯 Hedef Kitle ve Fırsatlar\n- **Kurumsal:** Operasyon maliyetini düşürmek isteyen şirketler.\n- **Bireysel:** Kendi hızında ilerlemek isteyen kullanıcılar.\n\n### ⚔️ Rekabet Durumu\n- Kurumsal çözümler pahalı ve hantal.\n- Ucuz çözümler ise deneyim ve veri katmanında zayıf.",
                    monetizationStrategy: "### 💰 Gelir Modeli Önerileri\n- **Freemium:** Temel kullanım ücretsiz, ileri raporlama ve entegrasyonlar ücretli.\n- **Kullanım Bazlı:** İşlem, aktif kullanıcı veya hacme göre kademeli fiyatlama.\n- **Kurumsal Paket:** SLA, özelleştirme ve premium destek içeren aylık abonelik.\n\n### 📈 Büyüme Stratejisi\nErken aşamada pilot müşteri ile referans yaratıp, sektör bazlı 2-3 örnek proje ile kurumsal satış hunisi oluşturun. Sonraki adımda partner kanallarına açılın.",
                    validationPlan: [
                        "10-15 hedef kullanıcı ile problem doğrulama görüşmesi",
                        "Tek sayfalık MVP + fiyatlama testi (ön kayıt/ödeme niyeti)",
                        "2 haftalık pilot kullanım ve geri bildirim döngüsü",
                        "Retention ve dönüşüm metriklerini netleştirme"
                    ],
                    openQuestions: [
                        "Hedef pazar önceliğiniz Türkiye mi global mi?",
                        "B2B mi B2C mi ilerlemek istiyorsunuz?",
                        "Ödeme ve fatura süreçleri zorunlu mu?",
                        "Veri açısından özel regülasyonlar var mı?"
                    ],
                    agensInsight: "Bu projeyi tek seferlik bir yazılım değil, **ölçeklenebilir bir ürün sistemi** olarak kurgulamalıyız. İlk hedefiniz; tek bir kullanıcı segmentinde güçlü bir değer kanıtı oluşturmak ve erken satış sinyali almak olmalı.\n\nMVP aşamasında bile doğru akışları kurarsak, hem kullanıcı memnuniyeti hem de gelir potansiyeli hızla artar. Sonraki fazda otomasyon ve raporlama ile marjlar yükselir.\n\n- En kritik akışı sadeleştirip ilk 2 dakikada değer gösterin.\n- Operasyonel süreçleri MVP'de manuel başlatın, otomasyonu faz 2'ye bırakın.\n- Veri toplama ve öğrenme döngüsünü ilk günden kurun.\n- Satış hunisi için tek bir segmentte net bir use-case seçin.\n\nDilerseniz 30 dakikalık bir keşif görüşmesiyle kapsamı netleştirip hızlı bir yol haritası çıkarabiliriz."
                };
                resolve(JSON.stringify(mockData));
            }, 2500);
        });
    }

    const systemPrompt = `Sen "Agens AI", premium bir yazılım stüdyosunun hem **Dijital CTO'su** hem de unicorn deneyimine sahip bir **Ürün Stratejistisin**.
Tonun: Profesyonel, net, ikna edici ve güven verici. Kullanıcıyı cesaretlendir, korkutma.

KRİTİK TALİMATLAR:
1. Yanıtı HER ZAMAN kullanıcının dilinde ver.
2. Yalnızca GEÇERLİ JSON döndür. Kod bloğu, açıklama ya da ekstra metin yazma.
3. Skorlamada gerçekçi-iyimser ol:
   - Net ve uygulanabilir fikirler: 75-92 arası.
   - Belirsiz/eksik fikirler: 60-75 arası; nedenini kibarca belirt.
   - 92+ sadece güçlü pazar avantajı ve net farklılaşma varsa.
4. Riskleri "kontrol edilebilir" şekilde yaz. Her madde "Risk - İlk çözüm adımı" formatında olsun.
5. Modüller:
   - Tüm gerekli modüller mvpModules veya phase2Modules içinde yer alsın.
   - MVP: 8-12 madde. Faz 2: 5-10 madde.
   - Sadece başlık yaz, açıklama yok.
   - Ticari ürünlerde sık görülen Admin Paneli, Landing Page, CMS, Bildirim, Loglama/Monitoring, Yedekleme gibi kalemleri gerekiyorsa ekle.
6. Altyapı/stack kısıtı yok; ürün tipine göre öner. recommendedStack sadece frontend/backend/infrastructure dizilerinden oluşsun.
   - Ödeme, e-fatura, SMS, KYC, harita, kargo, e-posta, analitik, CRM gibi entegrasyonlar gerekiyorsa bunları recommendedStack.infrastructure listesine kısa etiketlerle ekle (örn. "Ödeme: Iyzico", "Harita: Google Maps").
   - Ülke belirtilmiyorsa ve yanıt dili Türkçe ise varsayılan pazar Türkiye olsun.
   - Türkiye pazarı için: Iyzico, PayTR, Param, Sipay; e-fatura için Paraşüt/Logo/Uyumsoft; SMS için Netgsm gibi sağlayıcıları öner.
   - Global pazarda: Stripe/Adyen, Twilio vb. öner.
7. MVP süresi proje karmaşıklığına göre 4-6, 6-8, 8-12, 12-16, 16-24 gibi aralıklardan biri olsun; varsayılan verme.
8. executiveSummary: 1-2 cümlelik yönetici özeti ver. viabilityVerdict ile aynı cümleyi tekrar etme.
9. competitionDensity ve userDemand alanları için:
   - label: "Çok düşük / Düşük / Orta / Yüksek / Çok yüksek" skalasından biri olsun.
   - score: 0-100 arası değer ver.
10. marketAnalysis, monetizationStrategy, agensInsight alanlarında kompakt ama açıklayıcı, taranabilir Markdown kullan.
    - monetizationStrategy: en az 2 alt başlık ve 4-6 madde içersin.
    - agensInsight: en az 2 kısa paragraf ve 4-6 madde içersin.
11. validationPlan: 3-5 adım, hızlı ve düşük maliyetli doğrulama önerileri.
12. openQuestions: 3-6 net soru; kullanıcıyla yapılacak keşif görüşmesini doğal şekilde davet etsin.

Yanıtını HER ZAMAN aşağıdaki JSON formatında ver:
{
  "feasibilityScore": 82,
  "viabilityVerdict": "Teknik olarak uygulanabilir; doğru MVP kapsamıyla hızlıca doğrulanabilir.",
  "complexity": {
    "frontend": 45,
    "backend": 70,
    "ai": 55
  },
  "technicalChallenges": [
    "Risk - İlk çözüm adımı",
    "Risk - İlk çözüm adımı",
    "Risk - İlk çözüm adımı"
  ],
  "mvpModules": ["Modül 1", "Modül 2", "Modül 3"],
  "phase2Modules": ["Modül 1", "Modül 2", "Modül 3"],
  "recommendedStack": {
    "frontend": ["Next.js", "React Native"],
    "backend": ["Node.js", "PostgreSQL"],
    "infrastructure": ["AWS", "Cloudflare", "Ödeme: Iyzico"]
  },
  "mvpTimeline": "8-12 Hafta",
  "executiveSummary": "1-2 cümlelik kısa özet.",
  "competitionDensity": { "label": "Orta", "score": 55 },
  "userDemand": { "label": "Yüksek", "score": 78 },
  "marketAnalysis": "### Başlık\\n- Madde 1\\n- Madde 2",
  "monetizationStrategy": "### Başlık\\n- Madde 1\\n- Madde 2",
  "validationPlan": ["Adım 1", "Adım 2", "Adım 3"],
  "openQuestions": ["Soru 1", "Soru 2", "Soru 3"],
  "agensInsight": "### Strateji\\nKısa paragraf.\\n- Madde 1\\n- Madde 2"
}`;

    const userPrompt = `Bu ürün fikrini analiz et: "${idea}"`;

    try {
        const result = await callOpenAI([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ]);
        return result;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Agens AI şu an kalibrasyon modunda. Lütfen tekrar deneyin.");
    }
};

export const generateProjectBriefWithOpenAI = async (userIdea: string): Promise<string> => {
    if (!OPENAI_API_KEY) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`## AI Strategy Analysis for: "${userIdea}"\n\n**Core Value Proposition:**\nA streamlined solution focusing on efficiency and user engagement.\n\n**Recommended Tech Stack:**\n- Frontend: React or React Native\n- Backend: Node.js (Scalable)\n- Database: PostgreSQL\n\n**Key MVP Features:**\n1. User Authentication\n2. Real-time Dashboard\n3. automated reporting\n\n*Note: Add your API Key to enable real-time AI analysis.*`);
            }, 1500);
        });
    }

    const systemPrompt = `Sen üst düzey bir yazılım stüdyosunun Yapay Zeka yöneticisisin.
Kısa, profesyonel ve cesaret verici bir "İlk Bakış" özeti oluştur (Max 150 kelime).
Türkçe yanıt ver. Yanıtını düz metin olarak ver, JSON değil.`;

    const userPrompt = `Potansiyel bir müşteri şu fikri gönderdi: "${userIdea}"`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API hatası');
        }

        const data: OpenAIResponse = await response.json();
        return data.choices[0]?.message?.content || "Özet oluşturulamadı.";
    } catch (error) {
        console.error("OpenAI Error:", error);
        return "AI servisimiz şu an yoğun. Lütfen formu gönderin, detayları görüşelim.";
    }
};

// Check if OpenAI is configured
export const isOpenAIConfigured = (): boolean => {
    return !!OPENAI_API_KEY;
};
