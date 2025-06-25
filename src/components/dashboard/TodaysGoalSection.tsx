
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface TodaysGoalProps {
  tasksCompleted: number;
  totalTasks: number;
}

export const TodaysGoalSection = ({ 
  tasksCompleted, 
  totalTasks,
}: TodaysGoalProps) => {
  // Calculate points earned (assuming 3 points per completed task)
  const pointsEarned = tasksCompleted * 3;
  const totalPoints = 15;
  
  // Calculate completion rate based on points
  const completionRate = totalPoints > 0 ? Math.round(pointsEarned / totalPoints * 100) : 0;

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Target className="h-5 w-5 text-chichi-purple mr-2" />
          Today's Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Daily Tasks Progress */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <div className="text-xl font-bold">{tasksCompleted}/{totalTasks}</div>
          <p className="text-xs text-muted-foreground mb-2">
            {pointsEarned}/{totalPoints} points ({completionRate}% complete)
          </p>
          <Progress 
            className="h-2" 
            value={completionRate} 
          />
        </div>
        
        {/* Extra space to make the card feel less clipped */}
        <div className="text-sm mt-6 text-muted-foreground">
          <p>Complete daily tasks to earn points and maintain your streak.</p>
        </div>
      </CardContent>
    </Card>
  );
};
