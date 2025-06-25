
import { challengeManagement } from './api/challengeManagement';
import { challengeJoin } from './api/challengeJoin';
import { challengeValidation } from './api/challengeValidation';

export const challengeApi = {
  // Challenge management methods
  fetchChallenges: challengeManagement.fetchChallenges,
  createChallenge: challengeManagement.createChallenge,
  generateInviteToken: challengeManagement.generateInviteToken,
  cancelChallenge: challengeManagement.cancelChallenge,
  updateChallengePoints: challengeManagement.updateChallengePoints,

  // Challenge joining methods
  joinChallengeByToken: challengeJoin.joinChallengeByToken,
  manualJoinChallenge: challengeJoin.manualJoinChallenge,

  // Challenge validation methods
  validateChallengeToken: challengeValidation.validateChallengeToken
};
