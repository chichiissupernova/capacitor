
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Platform {
  name: string;
  completed: number;
  total: number;
}

interface ContentType {
  name: string;
  value: number;
  color: string;
}

interface PlatformCompletionProps {
  platformData: Platform[];
  contentTypeData: ContentType[];
}

export const PlatformCompletion = ({ platformData, contentTypeData }: PlatformCompletionProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Platform Completion</CardTitle>
        <CardDescription>Content completed by platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platformData.map((platform) => (
            <div key={platform.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{platform.name}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {platform.completed}/{platform.total}
                </span>
              </div>
              <Progress 
                value={(platform.completed / platform.total) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium mb-3">Content Type Breakdown</h4>
          <div className="grid grid-cols-2 gap-4">
            {contentTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm flex-1">{item.name}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
