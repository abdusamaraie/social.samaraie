// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Generate professional password reset email HTML
function generatePasswordResetEmail(userName: string, resetUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px; 
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 16px 32px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 24px 0; 
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 16px;
          margin: 24px 0;
          color: #92400e;
        }
        .link-fallback {
          word-break: break-all;
          background: #f3f4f6;
          padding: 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 12px;
          margin: 16px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Social Link Tree</p>
        </div>
        <div class="content">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password for your Social Link Tree account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for security reasons.
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <div class="footer">
            <p><strong>Best regards,</strong><br>The Social Link Tree Team</p>
            <p style="margin-top: 16px;">
              <small>
                If the button doesn't work, copy and paste this link:<br>
                <span class="link-fallback">${resetUrl}</span>
              </small>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Password Reset Request - Social Link Tree

Hello ${userName},

We received a request to reset your password for your Social Link Tree account.

Click the link below to reset your password:
${resetUrl}

⚠️ SECURITY NOTICE: This link will expire in 1 hour for security reasons.

If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
The Social Link Tree Team

If the link doesn't work, copy and paste this URL: ${resetUrl}
  `;

  return { html, text };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body = await req.json();
    const { email, userName, resetUrl } = body;

    // Validate required fields
    if (!email || !resetUrl || !userName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, userName, resetUrl' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate and sanitize resetUrl
    let validatedResetUrl = resetUrl;
    try {
      const url = new URL(resetUrl);
      
      // Log the hostname for debugging
      console.log(`🔗 Reset URL hostname: ${url.hostname}`);
      
      // Allow localhost for development/testing
      const allowedHostnames = [
        'social.samaraie.com',
        'social-samaraie.pages.dev',
        'localhost',
        '127.0.0.1'
      ];
      
      // Check if hostname is allowed (including localhost variations)
      const isAllowedHostname = allowedHostnames.some(allowed => 
        url.hostname === allowed || 
        url.hostname.includes('localhost') ||
        url.hostname.includes('127.0.0.1')
      );
      
      if (!isAllowedHostname) {
        console.warn(`⚠️ Unexpected hostname in resetUrl: ${url.hostname}`);
        console.log(`📝 Allowed hostnames: ${allowedHostnames.join(', ')}`);
      }
      
      // Ensure the path is correct
      if (!url.pathname.startsWith('/reset-password')) {
        console.warn(`⚠️ Unexpected path in resetUrl: ${url.pathname}`);
        console.log(`📝 Expected path: /reset-password`);
      }
      
      // Ensure token parameter exists
      if (!url.searchParams.has('token')) {
        return new Response(
          JSON.stringify({ error: 'Reset URL must contain a token parameter' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      validatedResetUrl = url.toString();
      console.log(`✅ Reset URL validated successfully: ${validatedResetUrl}`);
    } catch (urlError) {
      console.error('❌ Invalid resetUrl format:', resetUrl);
      return new Response(
        JSON.stringify({ error: 'Invalid reset URL format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'noreply@social.samaraie.com';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set in environment');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Attempting to send password reset email to: ${email} from: ${FROM_EMAIL}`);
    console.log(`Using validated reset URL: ${validatedResetUrl}`);

    // Generate email content
    const { html, text } = generatePasswordResetEmail(userName, validatedResetUrl);

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: '🔐 Password Reset Request - Social Link Tree',
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Resend API error:', response.status, errText);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errText }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Email sent successfully:', data?.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data?.id ?? null,
        message: 'Password reset email sent successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Mailer function error:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
