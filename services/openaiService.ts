// OpenAI Service for AI Analysis
const FUNCTION_BASE = '/.netlify/functions';

const mockAnalysis = {
    feasibilityScore: 86,
    viabilityVerdict: "Fikir uygulanabilir; doğru MVP kapsamı ve veri akışıyla hızlıca pazara çıkabilir.",
    executiveSummary: "Önce çekirdek akışı netleştirip MVP'yi hızla pazara çıkarmak, ilk gelir ve geri bildirimi 4-6 hafta içinde toplamayı sağlar. Doğru veri akışı ve basit otomasyonlarla bu fikir hızla ölçeklenebilir.",
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
    competitionDensity: { label: "Orta", score: 55 },
    userDemand: { label: "Yüksek", score: 78 },
    marketAnalysis: "### 📊 Pazar Büyüklüğü ve Trendler\nBu dikeyde rekabet **orta seviyede** ve çözüm kalitesi farklılaştırıcı.\n\n### 🎯 Hedef Kitle ve Fırsatlar\n\n- **Kurumsal:** Operasyon maliyetini düşürmek isteyen şirketler.\n- **Bireysel:** Kendi hızında ilerlemek isteyen kullanıcılar.\n\n### ⚔️ Rekabet Durumu\n\n- Kurumsal çözümler pahalı ve hantal.\n- Ucuz çözümler ise deneyim ve veri katmanında zayıf.",
    monetizationStrategy: "### 💰 Gelir Modeli Önerileri\n\n- **Freemium:** Temel kullanım ücretsiz, ileri raporlama ve entegrasyonlar ücretli.\n- **Kullanım Bazlı:** İşlem, aktif kullanıcı veya hacme göre kademeli fiyatlama.\n- **Kurumsal Paket:** SLA, özelleştirme ve premium destek içeren aylık abonelik.\n\n### 📈 Büyüme Stratejisi\n\nErken aşamada pilot müşteri ile referans yaratıp, sektör bazlı 2-3 örnek proje ile kurumsal satış hunisi oluşturun. Sonraki adımda partner kanallarına açılın.",
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

const parseErrorMessage = async (response: Response) => {
    const text = await response.text();
    if (!text) {
        return 'OpenAI API hatası';
    }
    try {
        const data = JSON.parse(text);
        return data.error || data.message || text;
    } catch {
        return text;
    }
};

const callFunction = async (endpoint: string, payload: Record<string, unknown>): Promise<string> => {
    const response = await fetch(`${FUNCTION_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message);
    }

    return response.text();
};

export const analyzeProductIdeaWithOpenAI = async (idea: string): Promise<string> => {
    try {
        return await callFunction('openai-analyze', { idea });
    } catch (error) {
        console.error("OpenAI Error:", error);
        if (import.meta.env.DEV) {
            return JSON.stringify(mockAnalysis);
        }
        throw new Error("Agens AI şu an kalibrasyon modunda. Lütfen tekrar deneyin.");
    }
};

export const generateProjectBriefWithOpenAI = async (userIdea: string): Promise<string> => {
    try {
        const result = await callFunction('openai-brief', { userIdea });
        return result || "Özet oluşturulamadı.";
    } catch (error) {
        console.error("OpenAI Error:", error);
        return "AI servisimiz şu an yoğun. Lütfen formu gönderin, detayları görüşelim.";
    }
};

export const isOpenAIConfigured = (): boolean => {
    return true;
};
