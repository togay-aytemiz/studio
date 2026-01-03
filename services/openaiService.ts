// OpenAI Service for AI Analysis
import { AIAnalysisResult } from '../types';
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const parseErrorMessage = async (response: Response) => {
    const text = await response.text();
    if (!text) {
        return 'OpenAI API hatası';
    }
    try {
        const data: unknown = JSON.parse(text);
        if (typeof data === 'string') {
            return data;
        }
        if (isRecord(data)) {
            if (typeof data.message === 'string') {
                return data.message;
            }
            if (typeof data.error === 'string') {
                return data.error;
            }
            if (isRecord(data.error) && typeof data.error.message === 'string') {
                return data.error.message;
            }
        }
        return text;
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

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string');

const isAIAnalysisResult = (value: unknown): value is AIAnalysisResult => {
    if (!isRecord(value)) {
        return false;
    }

    const complexity = value.complexity;
    const recommendedStack = value.recommendedStack;
    const competitionDensity = value.competitionDensity;
    const userDemand = value.userDemand;

    if (
        typeof value.feasibilityScore !== 'number' ||
        typeof value.viabilityVerdict !== 'string' ||
        typeof value.executiveSummary !== 'string' ||
        !isRecord(complexity) ||
        typeof complexity.frontend !== 'number' ||
        typeof complexity.backend !== 'number' ||
        typeof complexity.ai !== 'number' ||
        !isStringArray(value.technicalChallenges) ||
        !isStringArray(value.mvpModules) ||
        !isStringArray(value.phase2Modules) ||
        !isRecord(recommendedStack) ||
        !isStringArray(recommendedStack.frontend) ||
        !isStringArray(recommendedStack.backend) ||
        !isStringArray(recommendedStack.infrastructure) ||
        typeof value.mvpTimeline !== 'string' ||
        !isRecord(competitionDensity) ||
        typeof competitionDensity.label !== 'string' ||
        typeof competitionDensity.score !== 'number' ||
        !isRecord(userDemand) ||
        typeof userDemand.label !== 'string' ||
        typeof userDemand.score !== 'number' ||
        typeof value.marketAnalysis !== 'string' ||
        typeof value.monetizationStrategy !== 'string' ||
        !isStringArray(value.validationPlan) ||
        !isStringArray(value.openQuestions) ||
        typeof value.agensInsight !== 'string'
    ) {
        return false;
    }

    if (
        typeof value.implementationSteps !== 'undefined' &&
        !isStringArray(value.implementationSteps)
    ) {
        return false;
    }

    return true;
};

const parseAnalysisResult = (raw: string): AIAnalysisResult => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error('AI yaniti gecersiz JSON formatinda.');
    }

    if (!isAIAnalysisResult(parsed)) {
        throw new Error('AI yaniti beklenen formata uymuyor.');
    }

    return parsed;
};

export const analyzeProductIdeaWithOpenAI = async (idea: string): Promise<AIAnalysisResult> => {
    try {
        const responseText = await callFunction('openai-analyze', { idea });
        return parseAnalysisResult(responseText);
    } catch (error) {
        console.error("OpenAI Error:", error);
        if (import.meta.env.DEV) {
            return mockAnalysis;
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
    const flag = import.meta.env.VITE_AI_ENABLED;
    if (typeof flag === 'string') {
        return flag.toLowerCase() === 'true';
    }
    return true;
};
