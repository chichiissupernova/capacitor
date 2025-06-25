
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Award, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { startOfToday } from 'date-fns';
import { StreakRecoveryDialog } from './StreakRecoveryDialog';
import { useAuth } from '@/contexts/auth';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  canRecoverStreak: boolean;
  onRecoverStreak?: () => void;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  canRecoverStreak,
  onRecoverStreak
}) => {
  const { user } = useAuth();
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);

  // Add debugging with real-time streak tracking
  console.log('StreakCounter - User data and streak props:', {
    propsCurrentStreak: currentStreak,
    propsLongestStreak: longestStreak,
    userCurrentStreak: user?.currentStreak,
    userLongestStreak: user?.longestStreak,
    userPoints: user?.points,
    userLevel: user?.level,
    userLevelPoints: user?.levelPoints,
    userId: user?.id,
    timestamp: new Date().toISOString()
  });

  // Use the most up-to-date streak values from either props or user context
  const displayCurrentStreak = typeof user?.currentStreak === 'number' ? user.currentStreak : currentStreak;
  const displayLongestStreak = typeof user?.longestStreak === 'number' ? user.longestStreak : longestStreak;

  // Ensure streak values are valid numbers
  const safeCurrentStreak = typeof displayCurrentStreak === 'number' && !isNaN(displayCurrentStreak) && displayCurrentStreak >= 0
    ? displayCurrentStreak
    : 0;

  const safeLongestStreak = typeof displayLongestStreak === 'number' && !isNaN(displayLongestStreak) && displayLongestStreak >= 0
    ? displayLongestStreak
    : 0;

  console.log('StreakCounter - Final streak values being displayed:', {
    safeCurrentStreak,
    safeLongestStreak,
    originalCurrentStreak: currentStreak,
    originalLongestStreak: longestStreak
  });

  // Determine if streak is "hot" (5+ days)
  const isHotStreak = safeCurrentStreak >= 5;

  // Calculate days since last task completion
  const daysSinceLastCompletion = user?.lastActivityDate
    ? Math.floor((startOfToday().getTime() - new Date(user.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Determine if streak is broken
  const isStreakBroken = daysSinceLastCompletion !== null && daysSinceLastCompletion > 1;

  return (
    <>
      <Card className="bg-white rounded-xl p-5 border border-border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Your Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2 pt-0">
          <div className="mb-4">
            <div className="flex items-center">
              <motion.div
                className="mr-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                key={safeCurrentStreak} // Re-animate when streak changes
                transition={{
                  duration: 0.3,
                  ease: [0, 0.71, 0.2, 1.01]
                }}
              >
                <Flame className={cn(
                  "h-6 w-6",
                  isHotStreak
                    ? "text-chichi-orange animate-pulse"
                    : "text-chichi-orange"
                )} />
              </motion.div>
              <div>
                <div className="flex items-baseline">
                  <motion.span 
                    className="text-3xl font-bold text-chichi-orange mr-1"
                    key={safeCurrentStreak} // Re-animate when value changes
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {safeCurrentStreak}
                  </motion.span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {safeLongestStreak > safeCurrentStreak ?
                    `Best: ${safeLongestStreak} days` :
                    "Your best streak yet!"}
                </div>
              </div>
            </div>

            {/* Streak recovery notice if applicable */}
            {canRecoverStreak && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  className="w-full rounded-md p-2 flex items-center justify-between text-sm font-medium"
                  onClick={() => setShowRecoveryDialog(true)}
                >
                  <div className="flex items-center">
                    <Award className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Missed a day? Tap to recover your streak</span>
                  </div>
                  <Clock className="ml-2 h-4 w-4 text-gray-500" />
                </Button>
              </div>
            )}

            {/* Streak broken notice */}
            {isStreakBroken && (
              <div className="mt-3">
                <Badge variant="destructive" className="w-full rounded-md p-2 flex items-center justify-between text-sm font-medium">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <span>Oh no! Your streak has been broken.</span>
                  </div>
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Streak recovery dialog */}
      <StreakRecoveryDialog
        open={showRecoveryDialog}
        onOpenChange={setShowRecoveryDialog}
        onRecoveryComplete={onRecoverStreak}
      />
    </>
  );
};
