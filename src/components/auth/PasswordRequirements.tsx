
import React from 'react';

export const PasswordRequirements = () => {
  return (
    <div className="text-sm text-muted-foreground mt-2" id="password-requirements-list">
      <p className="font-medium mb-1">Password requirements:</p>
      <ul className="list-disc pl-5 space-y-1" role="list">
        <li>At least 8 characters long</li>
        <li>Contain uppercase and lowercase letters</li>
        <li>Contain at least one number</li>
        <li>Contain at least one special character</li>
      </ul>
    </div>
  );
};
