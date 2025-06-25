
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/auth/useAuth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { loginSchema, LoginFormValues } from './validation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = React.memo(({ onSuccess }: LoginFormProps) => {
  const { login, error: authError, clearError, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Use auth loading state or local submitting state
  const isFormDisabled = isSubmitting || authLoading;

  const onSubmit = useCallback(async (data: LoginFormValues) => {
    console.log('LoginForm: Form submission started');
    
    // Clear any previous errors
    if (clearError) {
      clearError();
    }
    setLocalError(null);
    setIsSubmitting(true);
    
    try {
      console.log("LoginForm: Attempting login for:", { email: data.email });
      
      await login(data.email, data.password);
      console.log('LoginForm: Login successful, calling onSuccess immediately');
      
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("LoginForm: Login failed with error:", error);
      setLocalError(error.message || "Login failed. Please try again.");
      setIsSubmitting(false);
    }
  }, [login, clearError, onSuccess]);

  // Show either auth error or local error
  const displayError = authError || (localError ? new Error(localError) : null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Login form">
        {displayError && (
          <Alert variant="destructive" className="mb-4" role="alert">
            <XCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            <AlertDescription>{displayError.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  {...field} 
                  type="email"
                  aria-required="true"
                  autoComplete="email"
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  aria-required="true"
                  autoComplete="current-password"
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-chichi-orange hover:bg-chichi-orange/90"
          disabled={isFormDisabled}
          aria-busy={isFormDisabled}
        >
          {isFormDisabled ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
});

LoginForm.displayName = 'LoginForm';
