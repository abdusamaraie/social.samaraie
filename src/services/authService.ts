// Simplified Authentication Service for Admin Access
// Handles admin login and password reset via email

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
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

interface PasswordResetToken {
  email: string;
  token: string;
  expiresAt: number;
  used: boolean;
}

class AuthService {
  private readonly STORAGE_KEY = 'social_link_tree_auth';
  private readonly PASSWORD_KEY = 'social_link_tree_admin_password';
  private readonly USERS = new Map<string, {
    email: string;
    passwordHash: string;
    user: AuthUser;
  }>();

  // Mock password reset tokens - in production, this would be a real database
  private readonly PASSWORD_RESET_TOKENS = new Map<string, PasswordResetToken>();

  constructor() {
    this.initializeDefaultAdmin();
  }

  private initializeDefaultAdmin() {
    // Create default admin user
    const adminUser: AuthUser = {
      id: 'admin-001',
      email: 'abdu@samaraie.com',
      name: 'Admin User',
      role: 'admin'
    };

    // Check if admin password already exists, if not generate one
    let adminPassword = localStorage.getItem(this.PASSWORD_KEY);
    
    if (!adminPassword) {
      // Generate a secure random password on first run
      adminPassword = this.generateSecurePassword();
      localStorage.setItem(this.PASSWORD_KEY, adminPassword);
      
      // Log the generated password (only on first run)
      console.log('🔐 ADMIN PASSWORD GENERATED:', adminPassword);
      console.log('⚠️  Save this password securely - it will not be shown again!');
    }

    // Hash the password securely
    const passwordHash = this.hashPassword(adminPassword);
    
    this.USERS.set(adminUser.email, {
      email: adminUser.email,
      passwordHash,
      user: adminUser
    });
  }

  private generateSecurePassword(): string {
    // Generate a secure 16-character password
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each character type
    password += 'A'; // Uppercase
    password += 'a'; // Lowercase
    password += '1'; // Number
    password += '!'; // Symbol
    
    // Fill the rest randomly
    for (let i = 4; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - in production use bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  private generatePasswordResetToken(): string {
    // Generate a secure random token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const userData = this.USERS.get(credentials.email);
      
      if (!userData) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      if (!this.verifyPassword(credentials.password, userData.passwordHash)) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Store user in session storage
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData.user));

      return {
        success: true,
        user: userData.user
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  async logout(): Promise<void> {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userData = sessionStorage.getItem(this.STORAGE_KEY);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      
      // Verify user still exists in our system
      if (this.USERS.has(user.email)) {
        return user;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Method to get the current admin password (for display purposes)
  getCurrentAdminPassword(): string | null {
    return localStorage.getItem(this.PASSWORD_KEY);
  }

  // Method to reset admin password (for security purposes)
  resetAdminPassword(): string {
    const newPassword = this.generateSecurePassword();
    localStorage.setItem(this.PASSWORD_KEY, newPassword);
    
    // Update the stored hash
    const userData = this.USERS.get('abdu@samaraie.com');
    if (userData) {
      userData.passwordHash = this.hashPassword(newPassword);
      this.USERS.set('abdu@samaraie.com', userData);
    }
    
    return newPassword;
  }

  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const userData = this.USERS.get(email);
      
      if (!userData) {
        // Don't reveal if user exists
        return {
          success: true
        };
      }

      // Generate reset token
      const resetToken = this.generatePasswordResetToken();
      const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour expiration

      // Store reset token
      this.PASSWORD_RESET_TOKENS.set(resetToken, {
        email,
        token: resetToken,
        expiresAt,
        used: false
      });

      // Generate reset URL with correct domain
      const resetUrl = `https://social.samaraie.com/reset-password?token=${resetToken}`;

      // Send email via Supabase Edge Function
      const emailSent = await this.sendPasswordResetEmail({
        email,
        resetToken,
        resetUrl,
        userName: userData.user.name
      });
      
      if (emailSent) {
        console.log('Password reset email sent successfully');
        return {
          success: true
        };
      } else {
        console.warn('Password reset email failed to send');
        return {
          success: false,
          error: 'Failed to send reset email'
        };
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
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
      const supabaseAccessToken = import.meta.env.VITE_SUPABASE_ACCESS_TOKEN;

      if (!supabaseUrl || !supabaseAccessToken) {
        console.error('Supabase configuration missing');
        return false;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/mailer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAccessToken}`,
        },
        body: JSON.stringify({
          email: data.email,
          userName: data.userName,
          resetUrl: data.resetUrl,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Mailer function error:', response.status, err);
        return false;
      }

      const result = await response.json();
      console.log('Password reset email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed calling mailer function:', error);
      return false;
    }
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<AuthResponse> {
    try {
      // Find and validate reset token
      const resetTokenData = this.PASSWORD_RESET_TOKENS.get(token);
      
      if (!resetTokenData) {
        return {
          success: false,
          error: 'Invalid reset token'
        };
      }

      if (resetTokenData.email !== email) {
        return {
          success: false,
          error: 'Token does not match email'
        };
      }

      if (resetTokenData.used) {
        return {
          success: false,
          error: 'Token has already been used'
        };
      }

      if (Date.now() > resetTokenData.expiresAt) {
        return {
          success: false,
          error: 'Token has expired'
        };
      }

      // Update password
      const userData = this.USERS.get(email);
      if (!userData) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const newPasswordHash = this.hashPassword(newPassword);
      userData.passwordHash = newPasswordHash;
      this.USERS.set(email, userData);

      // Mark token as used
      resetTokenData.used = true;
      this.PASSWORD_RESET_TOKENS.set(token, resetTokenData);

      return {
        success: true
      };
    } catch (error) {
      console.error('Password reset failed:', error);
      return {
        success: false,
        error: 'Password reset failed'
      };
    }
  }

  // Utility method to validate reset token (for password reset page)
  async validateResetToken(token: string): Promise<{ valid: boolean; email?: string; error?: string }> {
    try {
      const resetTokenData = this.PASSWORD_RESET_TOKENS.get(token);
      
      if (!resetTokenData) {
        return { valid: false, error: 'Invalid reset token' };
      }

      if (resetTokenData.used) {
        return { valid: false, error: 'Token has already been used' };
      }

      if (Date.now() > resetTokenData.expiresAt) {
        return { valid: false, error: 'Token has expired' };
      }

      return { valid: true, email: resetTokenData.email };
    } catch (error) {
      return { valid: false, error: 'Token validation failed' };
    }
  }
}

export const authService = new AuthService();
export type { AuthUser, LoginCredentials, AuthResponse };
