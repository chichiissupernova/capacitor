
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export class StorageService {
  private static readonly AVATARS_BUCKET = 'avatars';
  
  /**
   * Check if storage bucket exists and is accessible
   */
  static async checkBucketAccess(): Promise<boolean> {
    try {
      const { error } = await supabase
        .storage
        .from(this.AVATARS_BUCKET)
        .list('', { limit: 1 });
        
      return !error;
    } catch (error) {
      console.error("Storage bucket access check failed:", error);
      return false;
    }
  }
  
  /**
   * Uploads a user avatar to Supabase storage
   */
  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      // Check bucket access first
      const hasAccess = await this.checkBucketAccess();
      if (!hasAccess) {
        console.warn('Avatar storage bucket not accessible, using fallback');
        return null;
      }

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
      }
      
      if (file.size > 5242880) { // 5MB limit
        throw new Error('File size too large. Please upload an image smaller than 5MB.');
      }

      // Create a unique file name to avoid overwriting existing files
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${uuidv4()}.${fileExt}`;
      
      console.log(`Uploading avatar for user ${userId}: ${fileName}`);
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from(this.AVATARS_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        throw new Error(`Failed to upload avatar: ${uploadError.message}`);
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from(this.AVATARS_BUCKET)
        .getPublicUrl(fileName);
      
      console.log("Avatar uploaded successfully:", urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error in uploadAvatar:", error);
      throw error instanceof Error ? error : new Error("Failed to upload avatar");
    }
  }
  
  /**
   * Deletes a user's avatar from storage by URL
   */
  static async deleteAvatar(avatarUrl: string): Promise<boolean> {
    try {
      // Check bucket access first
      const hasAccess = await this.checkBucketAccess();
      if (!hasAccess) {
        console.warn('Avatar storage bucket not accessible');
        return false;
      }

      // Extract the path from the URL
      const urlObj = new URL(avatarUrl);
      const pathParts = urlObj.pathname.split('/');
      
      // The path in storage should be after the bucket name in the URL
      const bucketIndex = pathParts.findIndex(part => part === this.AVATARS_BUCKET);
      if (bucketIndex === -1) {
        console.error("Invalid avatar URL format");
        return false;
      }
      
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      console.log(`Deleting avatar: ${filePath}`);
      
      const { error } = await supabase
        .storage
        .from(this.AVATARS_BUCKET)
        .remove([filePath]);
        
      if (error) {
        console.error("Error deleting avatar:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteAvatar:", error);
      return false;
    }
  }
}
