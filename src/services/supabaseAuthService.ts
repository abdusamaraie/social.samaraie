// Supabase Authentication Service for Admin Access
// Handles admin login, password reset, and user management via Supabase

import { createClient } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_active?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

interface PasswordResetResponse {
  success: boolean;
  error?: string;
}

interface ResetTokenValidation {
  valid: boolean;
  email?: string;
  error?: string;
}

class SupabaseAuthService {
  private supabase;
  private readonly STORAGE_KEY = 'social_link_tree_auth';

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  // Hash password using Web Crypto API (client-side compatible)
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verify password by comparing hashes
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // Generate secure random token
  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login for:', credentials.email);

      // Use the auth-reset edge function for login to bypass RLS issues
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase configuration missing');
        return {
          success: false,
          error: 'Service configuration error'
        };
      }

      // Call the auth-reset function with login action
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'login',
          email: credentials.email,
          password: credentials.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login error:', response.status, errorData);
        return {
          success: false,
          error: errorData.error || 'Invalid email or password'
        };
      }

      const result = await response.json();
      
      if (result.success && result.user) {
        // Store user in session storage
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(result.user));
        
        console.log('✅ Login successful for:', credentials.email);
        return {
          success: true,
          user: result.user
        };
      } else {
        return {
          success: false,
          error: result.error || 'Invalid email or password'
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userData = sessionStorage.getItem(this.STORAGE_KEY);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      
      // Verify user still exists and is active in database
      const { data: userDataFromDb, error } = await this.supabase
        .from('admin_users')
        .select('id, is_active')
        .eq('id', user.id)
        .single();

      if (error || !userDataFromDb || !userDataFromDb.is_active) {
        // User no longer exists or is inactive, clear session
        sessionStorage.removeItem(this.STORAGE_KEY);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    try {
      console.log('🔍 Password reset requested for email:', email);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase configuration missing');
        return {
          success: false,
          error: 'Service configuration error'
        };
      }

      // Use the auth-reset edge function
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'request_reset',
          email: email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Auth reset function error:', response.status, errorData);
        return {
          success: false,
          error: errorData.error || 'Failed to request password reset'
        };
      }

      const result = await response.json();
      console.log('✅ Password reset request successful:', result);
      return { success: true };
    } catch (error) {
      console.error('❌ Password reset request failed:', error);
      return {
        success: false,
        error: 'Password reset request failed'
      };
    }
  }

  private async sendPasswordResetEmail(data: {
    email: string;
    resetToken: string;
    resetUrl: string;
    userName: string;
  }): Promise<boolean> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase configuration missing');
        return false;
      }

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
        console.error('❌ Mailer function error:', response.status, err);
        return false;
      }

      const result = await response.json();
      console.log('✅ Password reset email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('❌ Failed calling mailer function:', error);
      return false;
    }
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<PasswordResetResponse> {
    try {
      console.log('🔐 Attempting password reset for:', email);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase configuration missing');
        return {
          success: false,
          error: 'Service configuration error'
        };
      }

      // Use the auth-reset edge function
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'reset_password',
          email: email,
          token: token,
          newPassword: newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Auth reset function error:', response.status, errorData);
        return {
          success: false,
          error: errorData.error || 'Failed to reset password'
        };
      }

      const result = await response.json();
      console.log('✅ Password reset successful:', result);
      return { success: true };
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      return {
        success: false,
        error: 'Password reset failed'
      };
    }
  }

  async validateResetToken(token: string): Promise<ResetTokenValidation> {
    try {
      console.log('🔍 Validating reset token:', token);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Supabase configuration missing');
        return { valid: false, error: 'Service configuration error' };
      }

      // Use the auth-reset edge function
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          action: 'validate_token',
          token: token
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Auth reset function error:', response.status, errorData);
        return { valid: false, error: errorData.error || 'Token validation failed' };
      }

      const result = await response.json();
      console.log('✅ Token validation result:', result);
      return result;
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { valid: false, error: 'Token validation failed' };
    }
  }

  // Utility method to create admin user (for initial setup)
  async createAdminUser(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const passwordHash = await this.hashPassword(password);

      const { data, error } = await this.supabase
        .from('admin_users')
        .insert({
          email,
          password_hash: passwordHash,
          name,
          role: 'admin',
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create admin user:', error);
        return {
          success: false,
          error: 'Failed to create admin user'
        };
      }

      const user: AuthUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        created_at: data.created_at,
        updated_at: data.updated_at,
        is_active: data.is_active
      };

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('❌ Create admin user error:', error);
      return {
        success: false,
        error: 'Failed to create admin user'
      };
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
export type { AuthUser, LoginCredentials, AuthResponse, PasswordResetResponse, ResetTokenValidation };
