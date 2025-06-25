
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const ExpiredPasswordResetLink = () => {
  const navigate = useNavigate();
  
  const handleRequestNewLink = () => {
    navigate('/reset-password', { replace: true });
  };
  
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-lg font-medium">Password Reset Link Expired</h3>
      <p className="text-muted-foreground mb-4">
        Your password reset link has expired or is invalid. Please request a new link to reset your password.
      </p>
      <Button 
        onClick={handleRequestNewLink}
        className="w-full bg-chichi-orange hover:bg-chichi-orange/90"
      >
        Request New Link
      </Button>
    </div>
  );
};
