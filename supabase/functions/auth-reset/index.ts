// Supabase Edge Function for Password Reset with Database Integration
// This function handles password reset requests and validates tokens

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

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

// Generate secure random token
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash password using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
    const { action, email, token, newPassword, password } = body;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'login') {
      // Handle login
      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email and password are required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get user from database using service role (bypasses RLS)
      const { data: userData, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (fetchError || !userData) {
        console.log('User not found or inactive:', fetchError?.message);
        return new Response(
          JSON.stringify({ error: 'Invalid email or password' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Verify password
      const passwordHash = await hashPassword(password);
      if (passwordHash !== userData.password_hash) {
        console.log('Invalid password for user:', email);
        return new Response(
          JSON.stringify({ error: 'Invalid email or password' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.id);

      // Create user object for session
      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        last_login: userData.last_login,
        is_active: userData.is_active
      };

      console.log('Login successful for:', email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: user,
          message: 'Login successful'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else if (action === 'request_reset') {
      // Handle password reset request
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if user exists
      const { data: userData, error: fetchError } = await supabase
        .from('admin_users')
        .select('id, email, name')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (fetchError || !userData) {
        console.log('User not found or inactive:', fetchError?.message);
        return new Response(
          JSON.stringify({ error: 'Email not found in our system' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Generate reset token
      const resetToken = generateSecureToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Store reset token in database
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .insert({
          token: resetToken,
          user_id: userData.id,
          email: userData.email,
          expires_at: expiresAt.toISOString(),
          used: false
        });

      if (tokenError) {
        console.error('Failed to store reset token:', tokenError);
        return new Response(
          JSON.stringify({ error: 'Failed to generate reset token' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Generate reset URL
      const baseUrl = Deno.env.get('SITE_URL') || 'https://social.samaraie.com';
      const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

      console.log(`Generated reset URL for ${email}: ${resetUrl}`);

      // Send email via Resend
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

      // Generate email content
      const { html, text } = generatePasswordResetEmail(userData.name, resetUrl);

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
      console.log('Password reset email sent successfully:', data?.id);
      
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

    } else if (action === 'validate_token') {
      // Handle token validation
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Token is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const { data: tokenData, error } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (error || !tokenData) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Invalid or used reset token' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if token is expired
      const now = new Date();
      const expiresAt = new Date(tokenData.expires_at);
      if (now > expiresAt) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Reset token has expired' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ valid: true, email: tokenData.email }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else if (action === 'reset_password') {
      // Handle password reset
      if (!email || !token || !newPassword) {
        return new Response(
          JSON.stringify({ error: 'Email, token, and new password are required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Validate reset token
      const { data: tokenData, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('email', email)
        .eq('used', false)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ error: 'Invalid or used reset token' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if token is expired
      const now = new Date();
      const expiresAt = new Date(tokenData.expires_at);
      if (now > expiresAt) {
        return new Response(
          JSON.stringify({ error: 'Reset token has expired' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update user password
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenData.user_id);

      if (updateError) {
        console.error('Failed to update password:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update password' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Mark token as used
      await supabase
        .from('password_reset_tokens')
        .update({ 
          used: true,
          used_at: new Date().toISOString()
        })
        .eq('id', tokenData.id);

      console.log('Password reset successful for:', email);
      return new Response(
        JSON.stringify({ success: true, message: 'Password reset successfully' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Supported actions: login, request_reset, validate_token, reset_password' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Auth reset function error:', errorMessage);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
