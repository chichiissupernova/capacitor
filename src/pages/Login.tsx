
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm, SignupForm, PasswordRequirements } from '@/components/auth/AuthForms';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isLoading, error } = useAuth();
  const [showRequirements, setShowRequirements] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the path the user was trying to access
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  // If user is already logged in, redirect to the page they were trying to access
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("User is authenticated, checking for pending challenge");
      
      // Check if there's a pending challenge invite token
      const pendingToken = localStorage.getItem('pendingInviteToken');
      if (pendingToken) {
        console.log("Found pending invite token, redirecting to join flow");
        navigate(`/challenge/join?token=${pendingToken}`, { replace: true });
      } else {
        console.log("No pending challenge, redirecting to:", from);
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, isLoading]);

  // Helper to switch between login and signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    if (!isLogin) {
      // When switching to login, hide requirements
      setShowRequirements(false);
    }
  };

  // Handler for successful authentication
  const handleAuthSuccess = () => {
    console.log("Auth success, checking for pending challenge");
    
    // Check if there's a pending challenge invite token
    const pendingToken = localStorage.getItem('pendingInviteToken');
    if (pendingToken) {
      console.log("Found pending invite token, redirecting to join flow");
      navigate(`/challenge/join?token=${pendingToken}`, { replace: true });
    } else {
      console.log("No pending challenge, redirecting to:", from);
      navigate(from, { replace: true });
    }
  };

  // Handle forgot password navigation
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Navigating to forgot password page");
    navigate('/reset-password');
  };

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url('/lovable-uploads/9c2ae659-f23f-4a85-b2ea-3346c40fcbf2.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        role="main" 
        aria-labelledby="login-heading"
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center px-4 sm:px-6">
            <CardTitle id="login-heading" className="text-2xl sm:text-3xl font-bold">
              <span className="text-chichi-orange">CHICHI</span>
            </CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to your account" : "Create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {isLogin ? (
              <LoginForm onSuccess={handleAuthSuccess} />
            ) : (
              <>
                <SignupForm onSuccess={handleAuthSuccess} />
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowRequirements(true)}
                    className="text-xs"
                    aria-label="View password requirements"
                  >
                    View password requirements
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-4 sm:px-6">
            {isLogin && (
              <Button 
                variant="link" 
                className="text-sm sm:text-base text-chichi-purple"
                onClick={handleForgotPassword}
                aria-label="Forgot password"
              >
                Forgot password?
              </Button>
            )}
            <Button 
              variant="link" 
              onClick={toggleForm}
              className="w-full text-sm sm:text-base"
              aria-label={isLogin ? "Switch to signup form" : "Switch to login form"}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Button>
          </CardFooter>
        </Card>

        {/* Password requirements dialog */}
        <Dialog open={showRequirements} onOpenChange={setShowRequirements}>
          <DialogContent className="sm:max-w-md" role="dialog" aria-label="Password requirements">
            <DialogHeader>
              <DialogTitle>Password Requirements</DialogTitle>
              <DialogDescription>
                Your password must meet the following requirements:
              </DialogDescription>
            </DialogHeader>
            <PasswordRequirements />
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default LoginPage;
