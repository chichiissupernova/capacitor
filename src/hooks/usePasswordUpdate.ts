
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/passwordValidator';

interface UsePasswordUpdateReturn {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  updatePassword: (password: string) => Promise<void>;
}

export const usePasswordUpdate = (): UsePasswordUpdateReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const updatePassword = async (password: string) => {
    setError(null);
    setIsLoading(true);
    
    // Validate password strength
    const validationResult = validatePassword(password);
    if (!validationResult.isValid) {
      setError(validationResult.errors.join(". "));
      setIsLoading(false);
      toast({
        title: "Password update failed",
        description: validationResult.errors.join(". "),
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (error) {
      console.error("Password update error:", error);
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
      toast({
        title: "Password update failed",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isSuccess,
    updatePassword
  };
};
