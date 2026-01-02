interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
    text?: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
    try {
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
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
