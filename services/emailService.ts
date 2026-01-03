interface EmailDispatchPayload {
    customerEmail?: string;
    customerSubject?: string;
    customerHtml?: string;
    customerReplyTo?: string;
    adminTo?: string;
    adminSubject: string;
    adminHtml: string;
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
            finalPayload = {
                customerEmail: hasValidEmail(payload.email) ? payload.email : undefined,
                customerSubject: 'Agens AI analiz talebinizi aldik',
                customerHtml: `
                    <h3>Merhaba ${payload.name},</h3>
                    <p>Agens AI analiz talebinizi aldik. Raporunuza dair detaylari kontrol edip size en kisa surede geri donecegiz.</p>
                    <p>Bu e-postaya yanit vererek ek baglam veya beklentilerinizi paylasabilirsiniz.</p>
                    <br />
                    <p>Sevgiler,<br><strong>Agens Studio</strong></p>
                `,
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
            finalPayload = {
                customerEmail: hasValidEmail(payload.email) ? payload.email : undefined,
                customerSubject: 'Iletisim talebinizi aldik',
                customerHtml: `
                    <h3>Merhaba ${payload.name},</h3>
                    <p>Mesajinizi aldik. Ekibimiz en kisa surede sizinle iletisime gececek.</p>
                    <p>Bu e-postaya yanit vererek ek detay paylasabilirsiniz.</p>
                    <br />
                    <p>Sevgiler,<br><strong>Agens Studio</strong></p>
                `,
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
