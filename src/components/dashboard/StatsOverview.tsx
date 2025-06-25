
import { Calendar, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsOverviewProps {
  tasksCompleted: number;
  totalTasks: number;
  weeklyActivity: number;
  totalPoints: number;
  level: number;
  levelPoints: number;
  maxLevelPoints: number;
}

export const StatsOverview = ({ 
  tasksCompleted, 
  totalTasks, 
  weeklyActivity,
  totalPoints, 
  level,
  levelPoints,
  maxLevelPoints
}: StatsOverviewProps) => {
  // Validate all values to prevent UI issues
  const validTasksCompleted = isNaN(tasksCompleted) ? 0 : tasksCompleted;
  const validTotalTasks = isNaN(totalTasks) ? 0 : totalTasks;
  const validWeeklyActivity = isNaN(weeklyActivity) ? 0 : Math.min(100, weeklyActivity);
  const validLevel = isNaN(level) || level <= 0 ? 1 : level > 100 ? 1 : level;
  const validLevelPoints = isNaN(levelPoints) ? 0 : levelPoints;
  const validMaxLevelPoints = isNaN(maxLevelPoints) || maxLevelPoints <= 0 ? 100 : maxLevelPoints;

  // Calculate completion rate safely
  const completionRate = validTotalTasks > 0 ? Math.round(validTasksCompleted / validTotalTasks * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-chichi-purple/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          <Calendar className="h-4 w-4 text-chichi-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{validTasksCompleted}/{validTotalTasks}</div>
          <p className="text-xs text-chichi-text-muted">
            {validTotalTasks > 0 ? `${completionRate}% completion rate` : 'No tasks yet'}
          </p>
          <Progress 
            className="h-2 mt-2" 
            value={completionRate} 
            indicatorClassName="bg-chichi-purple" 
          />
        </CardContent>
      </Card>
      
      <Card className="border-chichi-purple/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
          <TrendingUp className="h-4 w-4 text-chichi-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{validWeeklyActivity}%</div>
          <p className="text-xs text-chichi-text-muted">
            {validWeeklyActivity > 0 ? '+12% from last week' : 'Start creating content!'}
          </p>
          <Progress 
            className="h-2 mt-2" 
            value={validWeeklyActivity} 
            indicatorClassName="bg-chichi-purple" 
          />
        </CardContent>
      </Card>
      
      <Card className="border-chichi-purple/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Points</CardTitle>
          <Award className="h-4 w-4 text-chichi-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPoints}</div>
          <p className="text-xs text-chichi-text-muted">
            Level {validLevel} Creator
          </p>
          <Progress 
            className="h-2 mt-2" 
            value={(validLevelPoints / validMaxLevelPoints) * 100} 
            indicatorClassName="bg-chichi-purple" 
          />
        </CardContent>
      </Card>
    </div>
  );
};
