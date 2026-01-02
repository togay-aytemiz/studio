// OpenAI Service for AI Analysis
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

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
                    implementationSteps: [
                        "Kullanıcı Girişi / Auth (Supabase)",
                        "Admin Yönetim Paneli",
                        "Landing Page (Tanıtım Sayfası)",
                        "Ödeme Sistemi Entegrasyonu (Stripe/Iyzico)",
                        "Veritabanı Şeması Tasarımı (PostgreSQL)",
                        "API Geliştirme (Node.js/NestJS)",
                        "Frontend Component Kütüphanesi",
                        "Bildirim Sistemi (Email/Push)",
                        "Kullanıcı Profil Yönetimi",
                        "İçerik Yönetim Sistemi (CMS)",
                        "Raporlama ve Analitik Paneli",
                        "Loglama ve İzleme Altyapısı",
                        "KVKK ve Gizlilik Sözleşmeleri",
                        "Yedekleme ve Kurtarma Senaryoları",
                        "Mobil Uyumluluk Testleri"
                    ],
                    recommendedStack: {
                        frontend: "Next.js + Tailwind (Web) / React Native (Mobil)",
                        backend: "Node.js (NestJS) veya Go",
                        infrastructure: "Supabase (Auth/DB) + Vercel (Hosting)"
                    },
                    mvpTimeline: "10-14 Hafta",
                    marketAnalysis: "### 📊 Pazar Büyüklüğü ve Trendler\nBu eğitim teknolojileri dikeyinde rekabet şu an **orta seviyede** (Blue Ocean).\n\n### 🎯 Hedef Kitle ve Fırsatlar\n- **Kurumsal:** İçi eğitim maliyetlerini düşürmek isteyen şirketler.\n- **Bireysel:** Kendi hızında öğrenmek isteyen profesyoneller.\n\n### ⚔️ Rekabet Durumu\nMevcut çözümler genellikle ikiye ayrılıyor:\n- Çok pahalı kurumsal LMS sistemleri\n- Kullanıcı deneyimi zayıf olan eski nesil platformlar",
                    monetizationStrategy: "### 💰 Gelir Modeli Önerileri\n\n- **Kullanım Başına Ödeme (Pay-as-you-go):** Sadece izlenen ders kadar ödeme.\n- **Freemium:** Temel içerikler ücretsiz, sertifikalar ücretli.\n\n### 📈 Büyüme Stratejisi\nİlerleyen aşamada, kurumsal müşteriler için SLA garantili, gelişmiş analitik raporlama ve beyaz etiket (white-label) seçenekleri sunan **aylık abonelik** paketlerine geçiş yaparak ARR hedeflerinizi büyütebilirsiniz.",
                    agensInsight: "Projeyi sadece bir yazılım olarak değil, yaşayan bir **öğrenme ekosistemi** olarak kurgulamalıyız. İşte stratejik yol haritanız:\n\n**1. Topluluk Odaklı Büyüme (Community-Led Growth):**\nTeknolojiden önce topluluğa yatırım yapın. Kullanıcıların sadece içerik tükettiği değil, birbirleriyle etkileşime girdiği 'Cohort-based' (dönem bazlı) sınıflar oluşturun. Bu, platforma olan sadakati (retention) %40 oranında artıracaktır.\n\n**2. 'Aha!' Anını Öne Çekin:**\nYönetim panelinin detaylarında kaybolmayın. Son kullanıcının platforma girdiği ilk 3 dakika içinde değer gördüğü o sihirli anı mükemmelleştirin. Admin süreçlerini gerekirse ilk aşamada manuel yönetin, ama öğrenci deneyimi asla eksik hissettirmemeli.\n\n**3. Veri Odaklı Kişiselleştirme:**\nKullanıcıların öğrenme hızını ve stilini analiz eden basit bir AI katmanı ekleyerek, onlara 'Sana Özel' hissini verin. Bu, rakiplerinizden sıyrılmanızı sağlayacak en büyük kozunuz olacaktır."
                };
                resolve(JSON.stringify(mockData));
            }, 2500);
        });
    }

    const systemPrompt = `Sen "Agens AI", premium bir yazılım stüdyosunun hem **Dijital CTO'su** hem de unicorn deneyimine sahip bir **Ürün Stratejistisin**.
Tonun: Profesyonel, vizyoner, teknik açıdan derinlikli ve güven verici.

KRİTİK TALİMATLAR:
1. Yanıtını HER ZAMAN kullanıcının sorusunun dilinde ver.
2. FORMAT VE STİL: Yanıtlarını **Markdown** formatında ver.
3. DETAY SEVİYESİ:
   - **Pazar Analizi** ve **Gelir Modeli** alanları için: "Pazar Analizi" veya "Gelir Modeli" diye ana başlık ATMA. Direkt alt başlıklarla (Örn: ### Pazar Büyüklüğü, ### Rekabet) konuya gir.
   - **Agens Insight:** "Agens Insight" diye başlık atma. Direkt stratejik tavsiyenle başla. Gerçek bir Ürün Danışmanlığı seansı gibi kurgula. En az 2 paragraf ve 3 madde işareti içeren stratejik bir yol haritası sun.
   - **FEASIBILITY SCORE (SKORLAMA):** 
     - **İyimser ve Teşvik Edici Ol:** Fikir saçma olmadığı sürece yüksek puanlar (85-98 arası) ver.
     - Amacımız kullanıcıyı projeye başlatmak, korkutmak değil.
     - Puanı düşürme, teknik zorlukları "aşılabilir meydan okumalar" olarak sun.
     - Skor, fikrin potansiyelini yansıtsın.
4. ALTYAPI MANTIĞI: 
   - MVP/Startup -> **Supabase** ekosistemini öner.
   - Enterprise/Scale -> **AWS** veya **Google Cloud** çözümlerini öner.
5. MVP Süresi (ÇOK KRİTİK):
   - Asla varsayılan veya ortalama bir değer (Örn: 10-14) VERME.
   - Basit projeler için: "4-6 Hafta" veya "6-8 Hafta"
   - Orta projeler için: "8-12 Hafta" veya "10-12 Hafta"
   - Karmaşık projeler için: "16-24 Hafta"
   - Projenin özelliklerine göre NET ve GERÇEKÇİ bir tahmin yap.
6. YAPILACAKLAR LİSTESİ (Implementation Steps):
   - Projenin hayata geçmesi için gereken TÜM MODÜLLERİ en ince detayına kadar listele.
   - Minimum 14, Maksimum 20 madde olsun.
   - Sadece başlık olarak ver, açıklama yazma.
   - Gerekliyse şunları mutlaka ekle: "Admin Paneli", "Landing Page", "CMS", "E-fatura Entegrasyonu", "Bildirim Sistemi", "Loglama", "Yedekleme".
   - Örn: ["Kullanıcı Girişi", "Admin Paneli", "Ödeme Sistemi", "Landing Page", ...]

Yanıtını HER ZAMAN aşağıdaki JSON formatında ver:
{
  "feasibilityScore": <0-100 arası sayı>,
  "viabilityVerdict": "<Teknik durumu özetleyen tek cümlelik net bir tespit>",
  "complexity": {
    "frontend": <0-100 arası sayı (Örn: 45)>,
    "backend": <0-100 arası sayı (Örn: 80)>,
    "ai": <0-100 arası sayı (Örn: 60)>
  },
  "technicalChallenges": ["<zorluk 1>", "<zorluk 2>", "<zorluk 3>"],
  "implementationSteps": ["<Modül 1>", "<Modül 2>", "<Modül 3>", "<Modül 4>", "<Modül 5>"],
  "recommendedStack": {
    "frontend": "<teknoloji>",
    "backend": "<teknoloji>",
    "infrastructure": "<Supabase veya AWS>"
  },
  "mvpTimeline": "<Hesaplanan Süre (Örn: 6-8 Hafta)>",
  "marketAnalysis": "<Markdown formatında ZENGİN ve YAPILANDIRILMIŞ analiz (Başlıklar, Maddeler)>",
  "monetizationStrategy": "<Markdown formatında ZENGİN ve YAPILANDIRILMIŞ strateji (Başlıklar, Maddeler)>",
  "agensInsight": "<Markdown formatında, maddeli ve paragraflı STRATEJİK ÜRÜN DANIŞMANLIĞI>"
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
