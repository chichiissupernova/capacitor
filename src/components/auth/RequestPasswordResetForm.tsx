
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

interface RequestPasswordResetFormProps {
  onSuccess: () => void;
}

export const RequestPasswordResetForm = ({ onSuccess }: RequestPasswordResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log("Requesting password reset for:", data.email);
      
      // Get the current origin and construct the redirect URL
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/reset-password`;
      
      console.log("Using redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Password reset error:", error);
        throw error;
      }

      console.log("Password reset email sent successfully");
      
      // Call onSuccess to show the confirmation message
      onSuccess();
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
      setError(errorMessage);
      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <p className="text-muted-foreground mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-chichi-orange hover:bg-chichi-orange/90"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
};
