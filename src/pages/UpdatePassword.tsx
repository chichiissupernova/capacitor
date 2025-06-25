
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';
import { PasswordUpdateSuccess } from '@/components/auth/PasswordUpdateSuccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const UpdatePasswordPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if this is a password reset flow
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Set the session for password reset
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setError('Invalid or expired reset link. Please request a new password reset.');
            toast({
              title: "Invalid reset link",
              description: "This password reset link is invalid or expired. Please request a new one.",
              variant: "destructive",
            });
          }
        } else {
          // Check if user has an active session
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setError('No valid session found. Please request a new password reset.');
            toast({
              title: "Session expired",
              description: "Your session has expired. Please request a new password reset.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [searchParams]);

  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };

  const handlePasswordUpdateSuccess = () => {
    setIsSuccess(true);
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFEFE9] to-[#fffdf9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFEFE9] to-[#fffdf9]">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              <span className="text-chichi-orange">CHICHI</span>
            </CardTitle>
            <CardDescription>
              {error ? "Reset Link Error" : isSuccess ? "Password Updated" : "Update your password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {error ? (
              <div className="text-center space-y-4">
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={handleBackToLogin}
                  className="w-full bg-chichi-orange hover:bg-chichi-orange/90"
                >
                  Back to Login
                </Button>
              </div>
            ) : isSuccess ? (
              <PasswordUpdateSuccess />
            ) : (
              <UpdatePasswordForm onSuccess={handlePasswordUpdateSuccess} />
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default UpdatePasswordPage;
