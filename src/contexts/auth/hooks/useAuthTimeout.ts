
import { useEffect } from 'react';

export const useAuthTimeout = (isLoading: boolean, setIsLoading: (loading: boolean) => void) => {
  useEffect(() => {
    let authTimeout: NodeJS.Timeout;
    
    if (isLoading) {
      // Reduced timeout from 10 seconds to 3 seconds for faster loading
      authTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
    
    return () => {
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
    };
  }, [isLoading, setIsLoading]);
};
