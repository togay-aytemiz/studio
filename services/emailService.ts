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
}

const hasValidEmail = (email?: string) => !!email && email.includes('@');

export const sendEmail = async (payload: ContactFormData | EmailDispatchPayload): Promise<boolean> => {
    let finalPayload: EmailDispatchPayload;

    if ('type' in payload) {
        // Format ContactFormData to EmailPayload
        if (payload.type === 'analysis_contact') {
            const customerName = payload.name;
            finalPayload = {
                customerEmail: hasValidEmail(payload.email) ? payload.email : undefined,
                customerSubject: 'Agens AI analiz talebinizi aldık',
                customerHtml: `
                    <div style="background:#05060b;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
                      <div style="max-width:560px;margin:0 auto;background:#0b1120;border:1px solid #1f2937;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.35);">
                        <div style="padding:28px 28px 20px;border-bottom:1px solid #1f2937;display:flex;align-items:center;gap:12px;">
                          <img src="https://agens.studio/A.png" alt="Agens Studio" width="36" height="36" style="display:block;border-radius:8px;background:#111827;padding:6px;" />
                          <div style="letter-spacing:0.4em;font-weight:700;font-size:14px;color:#f8fafc;">AGENS</div>
                        </div>
                        <div style="padding:28px;">
                          <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#f8fafc;">Merhaba ${customerName},</p>
                          <p style="margin:0 0 16px;line-height:1.6;color:#cbd5f5;">Agens AI analiz talebinizi aldık. Raporunuza dair detayları kontrol edip size en kısa sürede geri döneceğiz.</p>
                          <p style="margin:0 0 20px;line-height:1.6;color:#cbd5f5;">Bu e-postaya yanıt vererek ek bağlam veya beklentilerinizi paylaşabilirsiniz.</p>
                          <div style="padding:16px 18px;border-radius:12px;background:linear-gradient(135deg,#1e293b,#0f172a);border:1px solid #334155;color:#e2e8f0;font-size:13px;">
                            <strong style="color:#f8fafc;">Not:</strong> Analiz talebiniz uzman ekibimize iletildi. Uygun görülen projeler için yol haritası ve kapsam çalışması paylaşılır.
                          </div>
                          <div style="margin-top:24px;color:#94a3b8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Agens Studio</div>
                          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #1f2937;color:#64748b;font-size:11px;line-height:1.6;">
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
                    'Agens AI analiz talebinizi aldık. Raporunuza dair detayları kontrol edip size en kısa sürede geri döneceğiz.',
                    '',
                    'Bu e-postaya yanıt vererek ek bağlam veya beklentilerinizi paylaşabilirsiniz.',
                    '',
                    'Not: Analiz talebiniz uzman ekibimize iletildi. Uygun görülen projeler için yol haritası ve kapsam çalışması paylaşılır.',
                    '',
                    'Bu e-posta, Agens Studio web sitesindeki form üzerinden ilettiğiniz AI analiz talebine yanıt olarak gönderilmiştir.',
                    'Pazarlama amaçlı bir abonelik değildir ve tek seferlik bilgilendirme niteliğindedir.',
                    '',
                    'AGENS Studio'
                ].join('\n'),
                customerReplyTo: 'agens.studio@gmail.com',
                adminTo: 'agens.studio@gmail.com',
                adminSubject: `[ANALIZ TALEBI] ${payload.name} - ${payload.email}`,
                adminHtml: `
                    <h2>Yeni Analiz Talebi</h2>
                    <p><strong>Isim:</strong> ${payload.name}</p>
                    <p><strong>Email:</strong> ${payload.email}</p>
                    <p><strong>Telefon:</strong> ${payload.phone || 'Belirtilmedi'}</p>
                    <h3>Talep/Detaylar:</h3>
                    <pre>${payload.message}</pre>
                `,
                replyTo: hasValidEmail(payload.email) ? payload.email : undefined
            };
        } else {
            // Standard Contact Form
            const customerName = payload.name;
            finalPayload = {
                customerEmail: hasValidEmail(payload.email) ? payload.email : undefined,
                customerSubject: 'Mesajınızı aldık',
                customerHtml: `
                    <div style="background:#05060b;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
                      <div style="max-width:560px;margin:0 auto;background:#0b1120;border:1px solid #1f2937;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.35);">
                        <div style="padding:28px 28px 20px;border-bottom:1px solid #1f2937;display:flex;align-items:center;gap:12px;">
                          <img src="https://agens.studio/A.png" alt="Agens Studio" width="36" height="36" style="display:block;border-radius:8px;background:#111827;padding:6px;" />
                          <div style="letter-spacing:0.4em;font-weight:700;font-size:14px;color:#f8fafc;">AGENS</div>
                        </div>
                        <div style="padding:28px;">
                          <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#f8fafc;">Merhaba ${customerName},</p>
                          <p style="margin:0 0 10px;line-height:1.6;color:#cbd5f5;">Mesajınızı aldık. Talebiniz ekibimize iletildi.</p>
                          <p style="margin:0 0 18px;line-height:1.6;color:#cbd5f5;">Genellikle 24 saat içinde sizinle iletişime geçiyoruz. Dilerseniz bu süreyi beklemeden bizimle doğrudan telefon üzerinden de görüşebilirsiniz.</p>
                          <p style="margin:8px 0 0;line-height:1.6;color:#cbd5f5;">
                            Telefon: <a href="tel:+905074699692" style="color:#f8fafc;text-decoration:none;font-weight:600;">0507 469 9692</a>
                          </p>
                          <p style="margin:18px 0 0;line-height:1.6;color:#cbd5f5;">Bu e-postaya yanıt vererek ek bilgi veya doküman paylaşmanız süreci hızlandıracaktır.</p>
                          <p style="margin:18px 0 0;line-height:1.6;color:#cbd5f5;">İlginiz için teşekkür ederiz.</p>
                          <div style="margin-top:24px;color:#94a3b8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">AGENS Studio</div>
                          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #1f2937;color:#64748b;font-size:11px;line-height:1.6;">
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
