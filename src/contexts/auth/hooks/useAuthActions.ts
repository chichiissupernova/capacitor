
import { User } from '../types';
import { useAuthenticationActions } from './actions/useAuthenticationActions';
import { useUserActions } from './actions/useUserActions';
import { usePointsActions } from './actions/usePointsActions';

export const useAuthActions = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  clearError: () => void
) => {
  const authActions = useAuthenticationActions(setUser, setIsLoading, setError, clearError);
  const userActions = useUserActions(user, setUser, setIsLoading, setError);
  const pointsActions = usePointsActions(user, setIsLoading, setError, userActions.refreshUser, userActions.updateUserData);

  return {
    ...authActions,
    ...userActions,
    ...pointsActions
  };
};
