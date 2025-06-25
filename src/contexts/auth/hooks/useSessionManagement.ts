
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useSessionManagement = () => {
  const [session, setSession] = useState<Session | null>(null);

  const getInitialSession = async () => {
    try {
      console.log('useSessionManagement: Getting initial session');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('useSessionManagement: Session error:', sessionError);
        throw sessionError;
      }

      console.log('useSessionManagement: Initial session result:', !!session?.user);
      return session;
      
    } catch (error) {
      console.error("useSessionManagement: Failed to get initial session:", error);
      throw error;
    }
  };

  const setupAuthListener = (handleAuthStateChange: (event: string, session: Session | null) => Promise<void>) => {
    console.log('useSessionManagement: Setting up auth listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    return subscription;
  };

  return {
    session,
    setSession,
    getInitialSession,
    setupAuthListener
  };
};
