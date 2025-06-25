
import { RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export interface ContentIdea {
  title: string;
  hook: string;
  captionStarter: string;
  cta: string;
}

interface ContentIdeaDisplayProps {
  contentIdea: ContentIdea | null;
  onTryAgain: () => void;
  isLoading: boolean;
  isQuotaExceeded: boolean;
}

export function ContentIdeaDisplay({ 
  contentIdea, 
  onTryAgain, 
  isLoading, 
  isQuotaExceeded 
}: ContentIdeaDisplayProps) {
  if (!contentIdea) return null;

  return (
    <Card className="p-6 border-t-4 border-t-chichi-orange">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">Generated Content Idea</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onTryAgain}
            disabled={isLoading || isQuotaExceeded}
            className="flex gap-2 items-center"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Post Title</h3>
          <p className="text-lg font-semibold mt-1">{contentIdea.title}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Hook/Opening</h3>
          <p className="mt-1">{contentIdea.hook}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Caption Starter</h3>
          <p className="mt-1">{contentIdea.captionStarter}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Call to Action</h3>
          <p className="mt-1">{contentIdea.cta}</p>
        </div>

        <div className="mt-6">
          <label htmlFor="full-caption" className="block text-sm font-medium text-gray-700">
            Full Caption Draft
          </label>
          <Textarea 
            id="full-caption"
            className="mt-2 h-32"
            value={`${contentIdea.hook}\n\n${contentIdea.captionStarter}\n\n${contentIdea.cta}`}
            readOnly
          />
        </div>
      </div>
    </Card>
  );
}
