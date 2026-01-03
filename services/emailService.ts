interface EmailDispatchPayload {
    customerEmail?: string;
    customerSubject?: string;
    customerHtml?: string;
    customerText?: string;
    customerReplyTo?: string;
    adminTo?: string;
    adminSubject: string;
    adminHtml: string;
    adminText?: string;
    replyTo?: string;
}

interface ContactFormData {
    type: 'contact' | 'analysis_contact';
    name: string;
    email: string;
    phone?: string;
    message: string;
    analysisIdea?: string;
    executiveSummary?: string;
    technicalChallenges?: string[];
    agensInsight?: string;
    emailTheme?: 'dark' | 'light';
}

const hasValidEmail = (email?: string) => !!email && email.includes('@');

export const sendEmail = async (payload: ContactFormData | EmailDispatchPayload): Promise<boolean> => {
    let finalPayload: EmailDispatchPayload;

    if ('type' in payload) {
        // Format ContactFormData to EmailPayload
        if (payload.type === 'analysis_contact') {
            const customerName = payload.name;
            const isLight = payload.emailTheme === 'light';
            const pageBg = isLight ? '#f1f5f9' : '#05060b';
            const cardBg = isLight ? '#ffffff' : '#0b1120';
            const borderColor = isLight ? '#e2e8f0' : '#1f2937';
            const textPrimary = isLight ? '#0f172a' : '#f8fafc';
            const textSecondary = isLight ? '#475569' : '#cbd5f5';
            const subText = isLight ? '#64748b' : '#94a3b8';
            const highlightBg = isLight ? '#f8fafc' : '#0f172a';
            const highlightBorder = borderColor;
            const messageText = payload.message?.trim() ? payload.message : 'Belirtilmedi';
            const ideaText = payload.analysisIdea?.trim() || 'Paylaşılmadı';
            const executiveSummaryText = payload.executiveSummary?.trim() || 'Paylaşılmadı';
            const technicalChallenges = payload.technicalChallenges?.length ? payload.technicalChallenges : [];
            finalPayload = {
                customerEmail: hasValidEmail(payload.email) ? payload.email : undefined,
                customerSubject: 'Fikriniz için ilk AI analizi hazır',
                customerHtml: `
                    <div style="background:${pageBg};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:${textSecondary};">
                      <div style="max-width:560px;margin:0 auto;background:${cardBg};border:1px solid ${borderColor};border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.18);">
                        <div style="padding:24px 24px 20px;border-bottom:1px solid ${borderColor};">
                          <div style="display:flex;align-items:center;gap:12px;background:#000000;border-radius:12px;padding:10px 12px;width:fit-content;">
                            <img src="https://agens.studio/email-logo.png" alt="Agens Studio" width="24" height="24" style="display:block;border-radius:6px;background:transparent;padding:0;" />
                            <div style="letter-spacing:-0.4em;font-weight:700;font-size:14px;color:#ffffff;line-height:1;">AGENS</div>
                          </div>
                        </div>
                        <div style="padding:28px;">
                          <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:${textPrimary};">Merhaba ${customerName},</p>
                          <p style="margin:0 0 10px;line-height:1.6;color:${textSecondary};">Fikrinizi aldık.</p>
                          <p style="margin:0 0 16px;line-height:1.6;color:${textSecondary};">Paylaştığınız bilgiler doğrultusunda AI destekli ön analiz tamamlandı.</p>
                          <p style="margin:0 0 16px;line-height:1.6;color:${textSecondary};">Bir sonraki adımda, fikri birlikte ele alıp ürünleştirme ve teknik yol haritasını netleştirmek için kısa bir görüşme öneriyoruz.</p>
                          <p style="margin:0 0 16px;line-height:1.6;color:${textSecondary};">Genellikle 24 saat içinde sizinle iletişime geçiyoruz. Dilerseniz bu süreyi beklemeden bize doğrudan ulaşabilirsiniz:</p>
                          <p style="margin:0 0 16px;line-height:1.6;color:${textSecondary};">
                            Telefon: <a href="tel:+905074699692" style="color:${textPrimary};text-decoration:none;font-weight:600;">0507 469 9692</a>
                          </p>
                          <p style="margin:0 0 18px;line-height:1.6;color:${textSecondary};">Bu e-postaya yanıt vererek ek detay veya doküman paylaşmanız süreci hızlandıracaktır.</p>
                          <div style="margin:16px 0 0;padding:14px 16px;border-radius:12px;background:${highlightBg};border:1px solid ${highlightBorder};color:${textSecondary};font-size:13px;line-height:1.6;">
                            <div style="font-weight:700;color:${textPrimary};margin-bottom:6px;">Agens AI analiz detayınız</div>
                            <div style="margin-bottom:8px;"><strong>Fikir:</strong> ${ideaText}</div>
                            <div style="margin-bottom:8px;"><strong>Değerlendirme:</strong> ${executiveSummaryText}</div>
                            ${
                                technicalChallenges.length
                                    ? `<div style="margin-bottom:8px;"><strong>Teknik zorluklar:</strong><ul style="margin:6px 0 0 18px;padding:0;">${technicalChallenges
                                        .map(item => `<li style="margin:4px 0;">${item}</li>`)
                                        .join('')}</ul></div>`
                                    : ''
                            }
                            <div style="margin-top:8px;"><strong>Notunuz:</strong><br />${messageText.replace(/\n/g, '<br />')}</div>
                          </div>
                          <div style="margin-top:24px;color:${subText};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Agens Studio</div>
                          <div style="margin-top:18px;padding-top:14px;border-top:1px solid ${borderColor};color:${subText};font-size:11px;line-height:1.6;">
                            Bu e-posta, Agens Studio web sitesindeki form üzerinden ilettiğiniz <strong>AI analiz talebine</strong> yanıt olarak gönderilmiştir.
                            Pazarlama amaçlı bir abonelik değildir ve tek seferlik bilgilendirme niteliğindedir.
                          </div>
                        </div>
                      </div>
                    </div>
                `,
                customerText: [
                    `Merhaba ${customerName},`,
                    '',
                    'Fikrinizi aldık.',
                    '',
                    'Paylaştığınız bilgiler doğrultusunda AI destekli ön analiz tamamlandı.',
                    '',
                    'Bir sonraki adımda, fikri birlikte ele alıp ürünleştirme ve teknik yol haritasını netleştirmek için kısa bir görüşme öneriyoruz.',
                    '',
                    'Genellikle 24 saat içinde sizinle iletişime geçiyoruz.',
                    'Dilerseniz bu süreyi beklemeden bize doğrudan ulaşabilirsiniz:',
                    'Telefon: 0507 469 9692',
                    '',
                    'Bu e-postaya yanıt vererek ek detay veya doküman paylaşmanız süreci hızlandıracaktır.',
                    '',
                    'Agens AI analiz detayınız',
                    `Fikir: ${ideaText}`,
                    `Değerlendirme: ${executiveSummaryText}`,
                    technicalChallenges.length ? `Teknik zorluklar:\n- ${technicalChallenges.join('\n- ')}` : '',
                    `Notunuz: ${messageText}`,
                    '',
                    'Bu e-posta, Agens Studio web sitesindeki form üzerinden ilettiğiniz AI analiz talebine yanıt olarak gönderilmiştir.',
                    'Pazarlama amaçlı bir abonelik değildir ve tek seferlik bilgilendirme niteliğindedir.',
                    '',
                    'AGENS Studio'
                ].filter(Boolean).join('\n'),
                customerReplyTo: 'agens.studio@gmail.com',
                adminTo: 'agens.studio@gmail.com',
                adminSubject: `[ANALIZ TALEBI] ${payload.name} - ${payload.email}`,
                adminHtml: `
                    <h2>Yeni Analiz Talebi</h2>
                    <p><strong>Isim:</strong> ${payload.name}</p>
                    <p><strong>Email:</strong> ${payload.email}</p>
                    <p><strong>Telefon:</strong> ${payload.phone || 'Belirtilmedi'}</p>
                    <h3>Kullanıcı Notu:</h3>
                    <pre>${messageText}</pre>
                    <h3>Analiz Özeti</h3>
                    <p><strong>Fikir:</strong> ${ideaText}</p>
                    <p><strong>Değerlendirme:</strong> ${executiveSummaryText}</p>
                    ${
                        technicalChallenges.length
                            ? `<p><strong>Teknik zorluklar:</strong></p><ul>${technicalChallenges
                                .map(item => `<li>${item}</li>`)
                                .join('')}</ul>`
                            : ''
                    }
                `,
                adminText: [
                    'Yeni Analiz Talebi',
                    `Isim: ${payload.name}`,
                    `Email: ${payload.email}`,
                    `Telefon: ${payload.phone || 'Belirtilmedi'}`,
                    '',
                    'Kullanici Notu:',
                    messageText,
                    '',
                    'Analiz Özeti',
                    `Fikir: ${ideaText}`,
                    `Değerlendirme: ${executiveSummaryText}`,
                    technicalChallenges.length ? `Teknik zorluklar:\n- ${technicalChallenges.join('\n- ')}` : ''
                ].filter(Boolean).join('\n'),
                replyTo: hasValidEmail(payload.email) ? payload.email : undefined
            };
        } else {
            // Standard Contact Form
            const customerName = payload.name;
            const isLight = payload.emailTheme === 'light';
            const pageBg = isLight ? '#f1f5f9' : '#05060b';
            const cardBg = isLight ? '#ffffff' : '#0b1120';
            const borderColor = isLight ? '#e2e8f0' : '#1f2937';
            const textPrimary = isLight ? '#0f172a' : '#f8fafc';
            const textSecondary = isLight ? '#475569' : '#cbd5f5';
            const subText = isLight ? '#64748b' : '#94a3b8';
            finalPayload = {
                customerEmail: hasValidEmail(payload.email) ? payload.email : undefined,
                customerSubject: 'Mesajınızı aldık',
                customerHtml: `
                    <div style="background:${pageBg};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:${textSecondary};">
                      <div style="max-width:560px;margin:0 auto;background:${cardBg};border:1px solid ${borderColor};border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.18);">
                        <div style="padding:24px 24px 20px;border-bottom:1px solid ${borderColor};">
                          <div style="display:flex;align-items:center;gap:12px;background:#000000;border-radius:12px;padding:10px 12px;width:fit-content;">
                            <img src="https://agens.studio/email-logo.png" alt="Agens Studio" width="24" height="24" style="display:block;border-radius:6px;background:transparent;padding:0;" />
                            <div style="letter-spacing:-0.4em;font-weight:700;font-size:14px;color:#ffffff;line-height:1;">AGENS</div>
                          </div>
                        </div>
                        <div style="padding:28px;">
                          <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:${textPrimary};">Merhaba ${customerName},</p>
                          <p style="margin:0 0 10px;line-height:1.6;color:${textSecondary};">Mesajınızı aldık. Talebiniz ekibimize iletildi.</p>
                          <p style="margin:0 0 18px;line-height:1.6;color:${textSecondary};">Genellikle 24 saat içinde sizinle iletişime geçiyoruz. Dilerseniz bu süreyi beklemeden bizimle doğrudan telefon üzerinden de görüşebilirsiniz.</p>
                          <p style="margin:8px 0 0;line-height:1.6;color:${textSecondary};">
                            Telefon: <a href="tel:+905074699692" style="color:${textPrimary};text-decoration:none;font-weight:600;">0507 469 9692</a>
                          </p>
                          <p style="margin:18px 0 0;line-height:1.6;color:${textSecondary};">Bu e-postaya yanıt vererek ek bilgi veya doküman paylaşmanız süreci hızlandıracaktır.</p>
                          <p style="margin:18px 0 0;line-height:1.6;color:${textSecondary};">İlginiz için teşekkür ederiz.</p>
                          <div style="margin-top:24px;color:${subText};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">AGENS Studio</div>
                          <div style="margin-top:18px;padding-top:14px;border-top:1px solid ${borderColor};color:${subText};font-size:11px;line-height:1.6;">
                            Bu e-posta, Agens Studio web sitesindeki form üzerinden ilettiğiniz talebe yanıt olarak gönderilmiştir.
                            Pazarlama amaçlı bir abonelik değildir ve tek seferlik bilgilendirme niteliğindedir.
                          </div>
                        </div>
                      </div>
                    </div>
                `,
                customerText: [
                    `Merhaba ${customerName},`,
                    '',
                    'Mesajınızı aldık. Talebiniz ekibimize iletildi.',
                    '',
                    'Genellikle 24 saat içinde sizinle iletişime geçiyoruz.',
                    'Dilerseniz bu süreyi beklemeden bizimle doğrudan telefon üzerinden de görüşebilirsiniz.',
                    '',
                    '0507 469 9692',
                    '',
                    'Bu e-postaya yanıt vererek ek bilgi veya doküman paylaşmanız süreci hızlandıracaktır.',
                    '',
                    'İlginiz için teşekkür ederiz.',
                    '',
                    'Bu e-posta, Agens Studio web sitesindeki form üzerinden ilettiğiniz talebe yanıt olarak gönderilmiştir.',
                    'Pazarlama amaçlı bir abonelik değildir ve tek seferlik bilgilendirme niteliğindedir.',
                    '',
                    'AGENS Studio'
                ].join('\n'),
                customerReplyTo: 'agens.studio@gmail.com',
                adminTo: 'agens.studio@gmail.com',
                adminSubject: `[ILETISIM TALEBI] ${payload.name}`,
                adminHtml: `
                    <h2>Yeni Iletisim Mesaji</h2>
                    <p><strong>Isim:</strong> ${payload.name}</p>
                    <p><strong>Email:</strong> ${payload.email}</p>
                    <p><strong>Telefon:</strong> ${payload.phone || 'Belirtilmedi'}</p>
                    <h3>Mesaj:</h3>
                    <p>${payload.message}</p>
                `,
                adminText: [
                    'Yeni Iletisim Mesaji',
                    `Isim: ${payload.name}`,
                    `Email: ${payload.email}`,
                    `Telefon: ${payload.phone || 'Belirtilmedi'}`,
                    '',
                    'Mesaj:',
                    payload.message
                ].join('\n'),
                replyTo: hasValidEmail(payload.email) ? payload.email : undefined
            };
        }
    } else {
        finalPayload = payload;
    }

    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalPayload),
        });

        if (!response.ok) {
            console.error('Email sending failed:', await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error('Email service error:', error);
        return false;
    }
};
