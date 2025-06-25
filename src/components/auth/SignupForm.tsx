
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/auth';
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
import { validatePassword } from '@/utils/passwordValidator';
import { signupSchema, SignupFormValues } from './validation';

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { signup, error: authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidationResult, setPasswordValidationResult] = useState({ isValid: true, errors: [] as string[] });
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate as the user types
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = validatePassword(e.target.value);
    setPasswordValidationResult(result);
    form.setValue("password", e.target.value);
  };

  const onSubmit = async (data: SignupFormValues) => {
    clearError(); // Clear any previous errors
    setIsLoading(true);
    try {
      console.log("Signup form submission:", { email: data.email });
      
      await signup(data.email, data.password);
      // onSuccess callback is not needed as navigation happens in signup function
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is now done at the context level
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" aria-label="Signup form">
        {authError && (
          <Alert variant="destructive" className="mb-4" role="alert">
            <XCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            <AlertDescription>{authError.message}</AlertDescription>
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
                  onChange={(e) => field.onChange(e.target.value.trim())}
                  type="email"
                  aria-required="true"
                  autoComplete="email"
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
                  onChange={handlePasswordChange}
                  aria-required="true"
                  autoComplete="new-password"
                  aria-describedby="password-requirements"
                />
              </FormControl>
              {!passwordValidationResult.isValid && passwordValidationResult.errors.length > 0 && (
                <div 
                  className="text-xs text-amber-600 mt-1" 
                  id="password-requirements"
                  role="alert"
                >
                  <ul className="list-disc pl-4">
                    {passwordValidationResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  aria-required="true"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-chichi-orange hover:bg-chichi-orange/90"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};
