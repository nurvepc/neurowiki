interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  FEEDBACK_EMAIL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const {
    type,
    message,
    email,
    pageTitle,
    pageType,
    pagePath,
    turnstileToken,
    timestamp
  } = body;

  // Verify Turnstile token
  try {
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken || '',
        }),
      }
    );

    const turnstileData = await turnstileResponse.json() as { success: boolean };

    if (!turnstileData.success) {
      return new Response(JSON.stringify({ error: 'Security verification failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return new Response(JSON.stringify({ error: 'Security verification failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Send email via Resend
  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neurowiki Feedback <onboarding@resend.dev>',
        to: env.FEEDBACK_EMAIL,
        subject: `[${type?.toUpperCase() || 'FEEDBACK'}] ${pageTitle || 'Feedback'}`,
        html: `
          <h2>New Feedback Received</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Type</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${type || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Page</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${pageTitle || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Page Type</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${pageType || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Path</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${pagePath || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Time</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${timestamp ? new Date(timestamp).toLocaleString() : 'Not specified'}</td>
            </tr>
            ${email ? `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">User Email</td>
              <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ` : ''}
          </table>
          
          <h3 style="margin-top: 24px;">Message:</h3>
          <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; white-space: pre-wrap;">${message || 'No message'}</div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Failed to send feedback email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send feedback' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
