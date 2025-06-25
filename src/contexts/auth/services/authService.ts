import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { createInitialUserProfile } from '../utils';

export class AuthService {
  static async signUp(email: string, password: string, name: string): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      await createInitialUserProfile(data.user);
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account.",
      });
    }
  }

  static async signIn(email: string, password: string) {
    console.log('AuthService.signIn: Starting sign in for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('AuthService.signIn: Auth error:', error);
      throw error;
    }

    console.log('AuthService.signIn: Sign in successful for:', data.user?.email);
    
    // Don't manually process user data here - let the auth state change handler do it
    // This prevents race conditions between useAuthActions and useAuthState
    return data.user;
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    toast({
      title: "Success",
      description: "Signed out successfully!",
    });
  }

  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) {
      throw error;
    }
    toast({
      title: "Password Reset",
      description: "Password reset email sent! Please check your inbox.",
    });
  }

  static async updatePassword(password: string): Promise<void> {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      throw error;
    }
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully!",
    });
  }
}
