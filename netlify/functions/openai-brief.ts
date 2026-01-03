const SYSTEM_PROMPT = `Sen üst düzey bir yazılım stüdyosunun Yapay Zeka yöneticisisin.
Kısa, profesyonel ve cesaret verici bir "İlk Bakış" özeti oluştur (Max 150 kelime).
Türkçe yanıt ver. Yanıtını düz metin olarak ver, JSON değil.`;

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

  let userIdea = '';
  try {
    const body = JSON.parse(event.body || '{}');
    userIdea = body.userIdea || '';
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  if (!userIdea || userIdea.length < 5) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Idea is too short' })
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Potansiyel bir müşteri şu fikri gönderdi: "${userIdea}"` }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'OpenAI API hatası', details: errorText })
      };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'OpenAI response empty' })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
      body: content
    };
  } catch (error) {
    console.error('OpenAI brief error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'OpenAI request failed' })
    };
  }
};
