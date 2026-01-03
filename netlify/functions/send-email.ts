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
        const {
            customerEmail,
            customerSubject,
            customerHtml,
            customerText,
            customerReplyTo,
            adminTo,
            adminSubject,
            adminHtml,
            adminText,
            replyTo
        } = JSON.parse(event.body);

        if (!adminSubject || !adminHtml) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // 1. Send email to Customer (optional)
        if (customerEmail && customerSubject && customerHtml) {
            await resend.emails.send({
                from: 'Agens Studio <hello@mail.agens.studio>',
                to: [customerEmail],
                subject: customerSubject,
                html: customerHtml,
                text: customerText,
                replyTo: 'agens.studio@gmail.com'
            });
        }

        // 2. Send notification to You (Admin)
        await resend.emails.send({
            from: 'Agens Studio <hello@mail.agens.studio>',
            to: [adminTo || 'agens.studio@gmail.com'],
            replyTo: 'agens.studio@gmail.com',
            subject: adminSubject,
            html: adminHtml,
            text: adminText
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
