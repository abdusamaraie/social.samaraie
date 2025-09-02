// Email Service for Password Reset and Notifications
// This service handles sending emails using a secure server-side function.

import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface PasswordResetEmailData {
  email: string;
  resetToken: string;
  resetUrl: string;
  userName: string;
}

class EmailService {
  private resend: Resend | null = null;
  private readonly FROM_EMAIL: string;

  constructor() {
    // Client-side safe default: prefer calling the server function
    // Only initialize Resend if explicitly provided (not recommended on client)
    const clientApiKey = import.meta.env.VITE_RESEND_API_KEY;
    if (clientApiKey) {
      console.warn('VITE_RESEND_API_KEY is set. Avoid exposing secrets to client. Prefer server-side mailer.');
      this.resend = new Resend(clientApiKey);
    }

    this.FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'noreply@samaraie.com';
  }

  // Send password reset email via Supabase Edge Function (preferred, secure)
  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<boolean> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ACCESS_TOKEN;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/mailer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            email: data.email,
            userName: data.userName,
            resetUrl: data.resetUrl,
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          console.error('Mailer function error:', err);
          // fall through to optional client-side Resend if configured
        } else {
          return true;
        }
      } catch (error) {
        console.error('Failed calling mailer function:', error);
        // fall through to optional client-side Resend if configured
      }
    }

    // Fallback (not recommended): direct Resend from client only if explicitly configured
    if (this.resend) {
      try {
        const htmlContent = this.generatePasswordResetEmail(data);
        const textContent = this.generatePasswordResetText(data);

        const emailData = {
          from: this.FROM_EMAIL,
          to: [data.email],
          subject: '🔐 Password Reset Request - Social Link Tree',
          html: htmlContent,
          text: textContent,
        };

        const result = await this.resend.emails.send(emailData);
        return !!result.data;
      } catch (error) {
        console.error('Error sending password reset via client Resend:', error);
        return false;
      }
    }

    console.error('No secure mail path configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    return false;
  }

  // Test helper (kept for completeness; avoid in production client)
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.resend) return false;
    try {
      const result = await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return !!result.data;
    } catch (error) {
      console.error('Error sending email via client Resend:', error);
      return false;
    }
  }

  // Generate HTML email template for password reset
  generatePasswordResetEmail(data: PasswordResetEmailData): string {
    return `
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
          .button:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #666; 
            font-size: 14px; 
            border-top: 1px solid #e5e7eb;
            padding-top: 24px;
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
            <p>Hello <strong>${data.userName}</strong>,</p>
            <p>We received a request to reset your password for your Social Link Tree account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for security reasons.</div>
            
            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <div class="footer">
              <p><strong>Best regards,</strong><br>The Social Link Tree Team</p>
              <p style="margin-top: 16px;">
                <small>
                  If the button doesn't work, copy and paste this link:<br>
                  <span class="link-fallback">${data.resetUrl}</span>
                </small>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate plain text version for email clients that don't support HTML
  generatePasswordResetText(data: PasswordResetEmailData): string {
    return `
Password Reset Request - Social Link Tree

Hello ${data.userName},

We received a request to reset your password for your Social Link Tree account.

Click the link below to reset your password:
${data.resetUrl}

⚠️ SECURITY NOTICE: This link will expire in 1 hour for security reasons.

If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
The Social Link Tree Team

If the link doesn't work, copy and paste this URL: ${data.resetUrl}
    `;
  }

  // Generate welcome email template
  generateWelcomeEmail(userName: string, loginUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Social Link Tree</title>
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
          .content { 
            padding: 40px 30px; 
            text-align: center;
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
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Social Link Tree!</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Welcome to Social Link Tree! Your account has been created successfully.</p>
            <p>You can now log in and start managing your social media links.</p>
            
            <a href="${loginUrl}" class="button">Login to Dashboard</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p><strong>Best regards,</strong><br>The Social Link Tree Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
export type { EmailOptions, PasswordResetEmailData };
