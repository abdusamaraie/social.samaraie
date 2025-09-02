import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { useTheme } from '../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles, getButtonStyles } from '../utils/contrastUtils';
import { authService } from '../services/authService';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);
  const primaryButtonStyles = getButtonStyles(backgroundType, 'primary');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No reset token provided');
      return;
    }

    // Validate token format (basic check)
    if (token.length < 32) {
      setError('Invalid reset token format');
      return;
    }

    setTokenValid(true);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !email || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword(email, token, newPassword);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="backdrop-blur-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className={`text-2xl font-bold ${colors.text} mb-4`}>Invalid Reset Link</h1>
          <p className={`${colors.textSecondary} mb-6`}>
            The password reset link is invalid or has expired.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            className={`${primaryButtonStyles.default} ${primaryButtonStyles.hover} ${primaryButtonStyles.active}`}
          >
            Return to Login
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="backdrop-blur-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className={`text-2xl font-bold ${colors.text} mb-4`}>Password Reset Successfully!</h1>
          <p className={`${colors.textSecondary} mb-6`}>
            Your password has been updated. You will be redirected to the login page.
          </p>
          <div className="text-sm text-green-500">
            Redirecting to login...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card 
          className="backdrop-blur-xl p-8 shadow-2xl"
          style={glassStyles}
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>Reset Your Password</h1>
            <p className={`${colors.textSecondary} text-sm`}>
              Enter your email and new password to complete the reset
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className={colors.textSecondary}>Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'}`}
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className={colors.textSecondary}>New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'}`}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className={colors.textSecondary}>Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                className={`${backgroundType === 'gradient3' ? 'bg-black/10 border-black/20 text-gray-900 placeholder:text-gray-600' : 'bg-white/10 border-white/20 text-white placeholder:text-white/50'}`}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${primaryButtonStyles.default} ${primaryButtonStyles.hover} ${primaryButtonStyles.active} !text-white hover:!text-white`}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className={`${colors.textSecondary} hover:${colors.text} text-sm`}
              >
                Back to Login
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
