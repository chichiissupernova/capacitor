
import { useState, useEffect } from 'react';

export const useResetLinkValidator = (): boolean => {
  const [isLinkExpired, setIsLinkExpired] = useState(false);

  useEffect(() => {
    // This function detects if the current URL contains error parameters related to expired links
    const checkResetLink = () => {
      // Check both URL search params and hash fragment
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
      
      const errorInSearchParams = searchParams.get('error') === 'access_denied' || 
                              searchParams.get('error_code') === 'otp_expired';
                              
      const errorInHash = hashParams.get('error') === 'access_denied' || 
                      hashParams.get('error_code') === 'otp_expired';
      
      // Also check raw strings in case the parsing above doesn't work
      const rawUrl = window.location.href;
      const containsErrorString = rawUrl.includes('error=access_denied') || 
                              rawUrl.includes('error_code=otp_expired');
      
      if (errorInSearchParams || errorInHash || containsErrorString) {
        console.log("Password reset link identified as expired or invalid");
        setIsLinkExpired(true);
        return;
      }
      
      // Check if the URL has the recovery token in the hash
      if (!window.location.hash || (!window.location.hash.includes('type=recovery') && !rawUrl.includes('type=recovery'))) {
        // Only set as expired if we're on the update-password page
        if (window.location.pathname.includes('update-password')) {
          console.error("No recovery token found in URL for password reset");
          setIsLinkExpired(true);
        }
      }
    };

    checkResetLink();
  }, []);

  return isLinkExpired;
};
