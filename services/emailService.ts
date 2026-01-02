interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
    text?: string;
}

interface ContactFormData {
    type: 'contact' | 'analysis_contact';
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export const sendEmail = async (payload: EmailPayload | ContactFormData): Promise<boolean> => {
    let finalPayload: EmailPayload;

    if ('type' in payload) {
        // Format ContactFormData to EmailPayload
        if (payload.type === 'analysis_contact') {
            finalPayload = {
                to: 'hello@agens.studio',
                subject: `[ANALİZ TALEP] ${payload.name} - ${payload.email}`,
                html: `
                    <h2>Yeni Analiz Talebi</h2>
                    <p><strong>İsim:</strong> ${payload.name}</p>
                    <p><strong>Email:</strong> ${payload.email}</p>
                    <p><strong>Telefon:</strong> ${payload.phone || 'Belirtilmedi'}</p>
                    <h3>Mesaj/Detaylar:</h3>
                    <pre>${payload.message}</pre>
                `,
                replyTo: payload.email.includes('@') ? payload.email : undefined
            };
        } else {
            // Standard Contact Form
            finalPayload = {
                to: 'hello@agens.studio',
                subject: `[İLETİŞİM] ${payload.name}`,
                html: `
                    <h2>Yeni İletişim Mesajı</h2>
                    <p><strong>İsim:</strong> ${payload.name}</p>
                    <p><strong>Email:</strong> ${payload.email}</p>
                    <p><strong>Telefon:</strong> ${payload.phone || 'Belirtilmedi'}</p>
                    <h3>Mesaj:</h3>
                    <p>${payload.message}</p>
                `,
                replyTo: payload.email.includes('@') ? payload.email : undefined
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
