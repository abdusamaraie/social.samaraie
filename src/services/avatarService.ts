import { supabase } from '../supabase/info';

export interface AvatarUploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

class AvatarService {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly AVATAR_SIZE = 200; // 200x200px

  /**
   * Validate and resize image before upload
   */
  private async processImage(file: File): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to desired avatar size
        canvas.width = this.AVATAR_SIZE;
        canvas.height = this.AVATAR_SIZE;

        if (!ctx) {
          resolve(null);
          return;
        }

        // Calculate crop area for center square
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // Draw cropped and resized image
        ctx.drawImage(
          img,
          startX, startY, size, size, // source rectangle
          0, 0, this.AVATAR_SIZE, this.AVATAR_SIZE // destination rectangle
        );

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.9 // quality
        );
      };

      img.onerror = () => {
        resolve(null);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Validate file before processing
   */
  private validateFile(file: File): string | null {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, or WebP).';
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return 'File size must be less than 5MB.';
    }

    return null;
  }

  /**
   * Upload avatar to Supabase storage
   */
  async uploadAvatar(file: File, userId: string): Promise<AvatarUploadResult> {
    try {
      // Validate file
      const validationError = this.validateFile(file);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Process image
      const processedBlob = await this.processImage(file);
      if (!processedBlob) {
        return { success: false, error: 'Failed to process image. Please try again.' };
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, processedBlob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload image. Please try again.' };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        return { success: false, error: 'Failed to get image URL.' };
      }

      return {
        success: true,
        avatarUrl: urlData.publicUrl
      };

    } catch (error) {
      console.error('Avatar upload failed:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Delete old avatar from storage
   */
  async deleteAvatar(avatarUrl: string): Promise<boolean> {
    try {
      if (!avatarUrl || !avatarUrl.includes('profile-images')) {
        return true; // No avatar to delete
      }

      // Extract file path from URL
      const urlParts = avatarUrl.split('profile-images/');
      if (urlParts.length < 2) {
        return true; // Invalid URL format
      }

      const filePath = `avatars/${urlParts[1].split('?')[0]}`;

      const { error } = await supabase.storage
        .from('profile-images')
        .remove([filePath]);

      if (error) {
        console.warn('Failed to delete old avatar:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Error deleting avatar:', error);
      return false;
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedAvatarUrl(avatarUrl: string, size: number = 200): string {
    if (!avatarUrl) return '';

    // For Supabase storage, you can add transformations if using a CDN
    // For now, return the original URL
    return avatarUrl;
  }
}

// Export singleton instance
export const avatarService = new AvatarService();
