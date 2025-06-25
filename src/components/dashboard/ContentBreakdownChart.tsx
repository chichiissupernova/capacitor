
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContentBreakdownChartProps {
  weeklyData: Array<{
    week: string;
    posts: number;
    reels: number;
    stories: number;
  }>;
}

export const ContentBreakdownChart = ({ weeklyData }: ContentBreakdownChartProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">Content Breakdown</CardTitle>
        <CardDescription className="text-xs md:text-sm">Content types by week</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[180px] md:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={weeklyData}
              margin={isMobile ? { top: 5, right: 10, left: -20, bottom: 5 } : { top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                fontSize={isMobile ? 10 : 12} 
                tickMargin={isMobile ? 5 : 10}
                interval={isMobile ? 1 : 0}
              />
              <YAxis 
                fontSize={isMobile ? 10 : 12} 
                tickMargin={isMobile ? 2 : 5}
                width={isMobile ? 25 : 35}
                tick={{ dy: 0 }}
              />
              <Tooltip contentStyle={isMobile ? { fontSize: '10px' } : {}} />
              <Legend wrapperStyle={isMobile ? { fontSize: '10px' } : {}} />
              <Bar dataKey="stories" stackId="a" fill="#7E69AB" />
              <Bar dataKey="posts" stackId="a" fill="#9b87f5" />
              <Bar dataKey="reels" stackId="a" fill="#D946EF" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
