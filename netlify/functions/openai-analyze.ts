import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SYSTEM_PROMPT = `Sen "Agens AI", premium bir yazılım stüdyosunun hem **Dijital CTO'su** hem de unicorn deneyimine sahip bir **Ürün Stratejistisin**.
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
    - Listelerde her madde yeni satırda "-" ile başlasın; listeden önce mutlaka boş satır olsun.
    - monetizationStrategy: en az 2 alt başlık ve 4-6 madde içersin.
    - agensInsight: en az 2 kısa paragraf ve 4-6 madde içersin.
11. validationPlan: 3-5 adım, hızlı ve düşük maliyetli doğrulama önerileri.
12. openQuestions: 3-6 net soru; kullanıcıyla yapılacak keşif görüşmesini doğal şekilde davet etsin.

Yanıtını HER ZAMAN aşağıdaki JSON formatında ver:
{
  "feasibilityScore": 82,
  "viabilityVerdict": "Tek cümlelik net teknik tespit.",
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
  "marketAnalysis": "### Başlık\\n\\n- Madde 1\\n- Madde 2",
  "monetizationStrategy": "### Başlık\\n\\n- Madde 1\\n- Madde 2",
  "validationPlan": ["Adım 1", "Adım 2", "Adım 3"],
  "openQuestions": ["Soru 1", "Soru 2", "Soru 3"],
  "agensInsight": "### Strateji\\nKısa paragraf.\\n\\n- Madde 1\\n- Madde 2"
}`;

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' })
    };
  }

  let idea = '';
  try {
    const body = JSON.parse(event.body || '{}');
    idea = body.idea || '';
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  if (!idea || idea.length < 5) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Idea is too short' })
    };
  }

  // Determine email status for headers
  let emailStatus = 'Skipped';
  let emailErrorMsg = '';

  // Notify Admin about the new analysis request
  if (process.env.RESEND_API_KEY) {
    try {
      const adminEmail = 'agens.studio@gmail.com';
      await resend.emails.send({
        from: 'Agens Studio <hello@mail.agens.studio>',
        to: [adminEmail],
        replyTo: 'agens.studio@gmail.com',
        subject: `[ANALIZ BASLIYOR] Yeni Fikir Analizi`,
        html: `
          <h2>Yeni Bir Analiz İsteği Geldi</h2>
          <p><strong>Fikir:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #6366f1;">
            ${idea}
          </blockquote>
          <p><small>Bu email, kullanıcı "Analiz Et" butonuna bastığı an gönderilmiştir. İletişim formu doldurulmasa bile bu veriyi kaydetmiş olduk.</small></p>
        `
      });
      console.log('Admin notification email sent successfully.');
      emailStatus = 'Sent';
    } catch (emailError: any) {
      console.warn('Failed to send admin notification email:', emailError);
      emailStatus = 'Failed';
      emailErrorMsg = emailError.message || String(emailError);
    }
  } else {
    console.warn('RESEND_API_KEY is missing');
    emailStatus = 'Missing_Key';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Bu ürün fikrini analiz et: "${idea}"` }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })
    });

    // Add debug headers
    const debugHeaders = {
      ...headers,
      'Content-Type': 'application/json',
      'X-Email-Status': emailStatus,
      'X-Email-Error': emailErrorMsg.substring(0, 100) // Truncate to avoid header bloat
    };

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: 502,
        headers: debugHeaders,
        body: JSON.stringify({ error: 'OpenAI API hatası', details: errorText })
      };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return {
        statusCode: 502,
        headers: debugHeaders,
        body: JSON.stringify({ error: 'OpenAI response empty' })
      };
    }

    try {
      JSON.parse(content);
    } catch (error: any) {
      return {
        statusCode: 502,
        headers: debugHeaders,
        body: JSON.stringify({ error: 'Invalid JSON from OpenAI', details: content })
      };
    }

    return {
      statusCode: 200,
      headers: debugHeaders,
      body: content
    };
  } catch (error) {
    console.error('OpenAI function error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'X-Email-Status': emailStatus }, // Return email status even on error
      body: JSON.stringify({ error: 'OpenAI request failed' })
    };
  }
};
