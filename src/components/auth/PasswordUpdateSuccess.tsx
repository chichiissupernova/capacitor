
import { CheckCircle } from 'lucide-react';

export const PasswordUpdateSuccess = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-lg font-medium">Password updated successfully</h3>
      <p className="text-muted-foreground">
        You will be redirected to the login page shortly.
      </p>
    </div>
  );
};
