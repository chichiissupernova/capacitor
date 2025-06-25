
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyActivityChartProps {
  activityData: Array<{
    name: string;
    points: number;
  }>;
}

export const DailyActivityChart = ({ activityData }: DailyActivityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity</CardTitle>
        <CardDescription>Points earned in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickMargin={10} />
              <YAxis fontSize={12} tickMargin={5} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="points"
                stroke="#9b87f5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPoints)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
