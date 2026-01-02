import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event: any) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight OPTIONS request
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

    try {
        const { to, subject, html, replyTo } = JSON.parse(event.body);

        if (!to || !subject || !html) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // 1. Send email to Customer
        await resend.emails.send({
            from: 'Agens Studio <hello@agens.studio>',
            to: [to],
            subject: subject,
            html: html,
            reply_to: 'agens.studio@gmail.com'
        });

        // 2. Send notification to You (Admin)
        await resend.emails.send({
            from: 'Agens Studio <hello@agens.studio>',
            to: ['agens.studio@gmail.com'], // Notification to admin
            reply_to: to, // Reply to the customer directly
            subject: `[YENİ FORM] ${subject}`,
            html: `
                <h3>Yeni Form Gönderisi 🚀</h3>
                <p><strong>Gönderen:</strong> ${replyTo || to}</p>
                <p><strong>Konu:</strong> ${subject}</p>
                <hr />
                <div>${html}</div>
            `
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('Email error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Email sending failed' })
        };
    }
};
