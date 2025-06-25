
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { RequestPasswordResetForm } from '@/components/auth/RequestPasswordResetForm';
import { PasswordResetEmailSent } from '@/components/auth/PasswordResetEmailSent';
import { ExpiredPasswordResetLink } from '@/components/auth/ExpiredPasswordResetLink';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';
import { PasswordUpdateSuccess } from '@/components/auth/PasswordUpdateSuccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    console.log('ResetPassword component mounted');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    const handlePasswordReset = async () => {
      try {
        console.log('ResetPassword: Checking URL params and session');
        
        // Get all possible token parameters from URL
        const tokenHash = searchParams.get('token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorCode = searchParams.get('error_code');
        
        console.log('URL params:', { tokenHash: !!tokenHash, type, error, errorCode });
        
        // Check for explicit errors first
        if (error === 'access_denied' || errorCode === 'otp_expired') {
          console.log('Password reset link is expired or invalid');
          setIsLinkExpired(true);
          setIsLoading(false);
          return;
        }
        
        // Handle password reset flow with token
        if (type === 'recovery' && tokenHash) {
          console.log('Verifying password reset token');
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          });
          
          if (verifyError) {
            console.error('Error verifying password reset token:', verifyError);
            setIsLinkExpired(true);
            toast({
              title: "Invalid reset link",
              description: "This password reset link is invalid or expired. Please request a new one.",
              variant: "destructive",
            });
          } else if (data.session) {
            console.log('Password reset token verified successfully, switching to update mode');
            setIsUpdateMode(true);
          } else {
            console.log('Token verified but no session created');
            setIsLinkExpired(true);
          }
        } else if (type === 'recovery' && !tokenHash) {
          console.log('Recovery type but no token found');
          setIsLinkExpired(true);
        } else {
          // No recovery type - show request form
          console.log('No recovery parameters found, showing request form');
        }
      } catch (error) {
        console.error('Error in password reset flow:', error);
        setIsLinkExpired(true);
        toast({
          title: "Reset link error",
          description: "There was an error processing your reset link. Please request a new one.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handlePasswordReset();
  }, [searchParams]);
  
  // Navigate back to login with replace: true to avoid navigation issues
  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };

  // Handle successful password reset request
  const handlePasswordResetSuccess = () => {
    console.log("Password reset email sent successfully, showing confirmation");
    setIsSuccess(true);
  };

  // Handle successful password update
  const handlePasswordUpdateSuccess = () => {
    setIsPasswordUpdated(true);
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully. Redirecting to login...",
    });
    // Auto-redirect after 3 seconds
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 3000);
  };

  // Debug rendering
  console.log('ResetPassword render state:', {
    isLoading,
    isLinkExpired,
    isPasswordUpdated,
    isUpdateMode,
    isSuccess
  });

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFEFE9] to-[#fffdf9]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Processing reset link...</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  const getTitle = () => {
    if (isLinkExpired) return "Link Expired";
    if (isPasswordUpdated) return "Password Updated";
    if (isUpdateMode) return "Update your password";
    if (isSuccess) return "Check your email";
    return "Reset your password";
  };

  const renderContent = () => {
    if (isLinkExpired) {
      return <ExpiredPasswordResetLink />;
    }
    
    if (isPasswordUpdated) {
      return <PasswordUpdateSuccess />;
    }
    
    if (isUpdateMode) {
      return <UpdatePasswordForm onSuccess={handlePasswordUpdateSuccess} />;
    }
    
    if (isSuccess) {
      return <PasswordResetEmailSent />;
    }
    
    return <RequestPasswordResetForm onSuccess={handlePasswordResetSuccess} />;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFEFE9] to-[#fffdf9]">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              <span className="text-chichi-orange">CHICHI</span>
            </CardTitle>
            <CardDescription>
              {getTitle()}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {renderContent()}
          </CardContent>
          {!isPasswordUpdated && (
            <CardFooter className="flex flex-col space-y-4 px-4 sm:px-6">
              <Button 
                variant="link" 
                className="w-full text-sm sm:text-base"
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default ResetPassword;
