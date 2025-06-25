
import { CheckCircle } from 'lucide-react';

export const PasswordResetEmailSent = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-lg font-medium">Check your email</h3>
      <p className="text-muted-foreground">
        We've sent a password reset link to your email address.
      </p>
    </div>
  );
};
