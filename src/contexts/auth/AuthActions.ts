
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from './types';
import { updateUserProfile, fetchUserProfile, mapSupabaseUserToUser } from './utils';

export class AuthActions {
  static async signUp(email: string, password: string, name: string): Promise<void> {
    console.log('Starting signup process for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    if (data.user && !data.user.email_confirmed_at) {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link.",
      });
    }

    console.log('Signup successful:', data.user?.email);
  }

  static async signIn(email: string, password: string): Promise<void> {
    console.log('Starting signin process for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      throw error;
    }

    console.log('Signin successful:', data.user?.email);
    
    toast({
      title: "Welcome back!",
      description: "You've been signed in successfully.",
    });
  }

  static async signOut(): Promise<void> {
    console.log('Starting signout process');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Signout error:', error);
      throw error;
    }
    
    console.log('Signout successful');
    
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  }

  static async updateUserPoints(user: User, points: number): Promise<User> {
    if (!user) {
      throw new Error("Cannot update points: No user signed in.");
    }

    const newPoints = user.points + points;
    
    // Calculate new level based on points
    const newLevel = Math.floor(newPoints / 100) + 1;
    const newLevelPoints = newPoints % 100;
    const maxLevelPoints = 100;

    const updatedUser = { 
      ...user, 
      points: newPoints,
      level: newLevel,
      levelPoints: newLevelPoints,
      maxLevelPoints: maxLevelPoints
    };

    // Update in database - use camelCase properties, conversion happens in updateUserProfile
    await updateUserProfile(user.id, { 
      points: newPoints,
      level: newLevel,
      levelPoints: newLevelPoints
    });

    toast({
      title: "Points Updated",
      description: `You've earned ${points} points!`,
    });

    return updatedUser;
  }

  static async updateUserData(user: User, userData: Partial<User>): Promise<User> {
    if (!user) {
      throw new Error("Cannot update user data: No user signed in.");
    }

    const updatedUser = { ...user, ...userData };
    
    // Pass the userData directly - updateUserProfile will handle the conversion
    await updateUserProfile(user.id, userData);

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully!",
    });

    return updatedUser;
  }

  static async updateUserName(user: User, name: string): Promise<User> {
    if (!user) {
      throw new Error("Cannot update name: No user signed in.");
    }

    const updatedUser = { ...user, name };
    await updateUserProfile(user.id, { name });

    toast({
      title: "Name Updated",
      description: "Your name has been updated successfully!",
    });

    return updatedUser;
  }

  static async updateUserAvatar(user: User, avatarUrl: string): Promise<User> {
    if (!user) {
      throw new Error("Cannot update avatar: No user signed in.");
    }

    const updatedUser = { ...user, avatarUrl };
    await updateUserProfile(user.id, { avatarUrl });

    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been updated successfully!",
    });

    return updatedUser;
  }

  static async refreshUser(userId: string): Promise<User | null> {
    console.log("=== REFRESH USER START ===");
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    
    if (!supabaseUser) {
      console.log("No authenticated user found during refresh");
      return null;
    }

    console.log("Refreshing user profile for ID:", supabaseUser.id);
    const userProfile = await fetchUserProfile(supabaseUser.id);
    
    if (userProfile) {
      const updatedUser = mapSupabaseUserToUser(supabaseUser, userProfile);
      console.log("Setting refreshed user data:", updatedUser);
      console.log("=== REFRESH USER SUCCESS ===");
      return updatedUser;
    } else {
      console.warn("No user profile found during refresh");
      return null;
    }
  }

  static async updateUserStreak(user: User): Promise<void> {
    if (!user) {
      throw new Error("Cannot update streak: No user signed in.");
    }

    toast({
      title: "Streak Updated",
      description: "Your streak has been updated!",
    });
  }

  static async completeTask(user: User): Promise<Partial<User>> {
    if (!user) return {};
    
    const tasksCompleted = (user.tasksCompleted || 0) + 1;
    const totalTasks = (user.totalTasks || 0) + 1;
    
    // Update in database - use camelCase properties, conversion happens in updateUserProfile
    await updateUserProfile(user.id, { 
      tasksCompleted,
      totalTasks 
    });
    
    return {
      tasksCompleted,
      totalTasks
    };
  }

  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      throw error;
    }

    toast({
      title: "Reset email sent",
      description: "Check your email for password reset instructions.",
    });
  }

  static async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      throw error;
    }

    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
  }
}
