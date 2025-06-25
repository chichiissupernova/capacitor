
import { RefreshCw, Calendar, Lightbulb, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface ContentDay {
  day: number;
  title: string;
  prompt: string;
  format: string;
  chichiTip: string;
}

export interface ContentPlan {
  days: ContentDay[];
}

interface ContentPlanDisplayProps {
  contentPlan: ContentPlan | null;
  onTryAgain: () => void;
  isLoading: boolean;
  isQuotaExceeded: boolean;
}

export function ContentPlanDisplay({ 
  contentPlan, 
  onTryAgain, 
  isLoading, 
  isQuotaExceeded 
}: ContentPlanDisplayProps) {
  const navigate = useNavigate();

  if (!contentPlan) return null;

  const handleSaveToNotes = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const noteTitle = `7-Day Content Plan - ${formattedDate}`;
    
    let noteContent = `📅 7-Day Content Plan\nGenerated: ${formattedDate}\n\n`;
    
    contentPlan.days.forEach(day => {
      noteContent += `📌 DAY ${day.day}: ${day.title}\n`;
      noteContent += `💡 Content Idea: ${day.prompt}\n`;
      noteContent += `🎯 Format: ${day.format}\n`;
      noteContent += `✨ ChiChi Tip: ${day.chichiTip}\n\n`;
    });
    
    noteContent += `\n📝 Remember to customize these ideas to match your brand voice and audience preferences!`;
    
    // Store the note data in localStorage with better formatting
    const noteData = {
      title: noteTitle,
      content: noteContent.trim(),
      color: 'yellow'
    };
    
    localStorage.setItem('pendingNote', JSON.stringify(noteData));
    
    // Navigate to notes page
    navigate('/notes');
    
    toast({
      title: "Saved to Notes!",
      description: "Your content plan has been saved and you'll find it in your notes.",
    });
  };

  return (
    <Card className="p-4 border-t-4 border-t-chichi-orange">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">Your 7-Day Content Plan</h2>
        <Button
          variant="outline"
          onClick={onTryAgain}
          disabled={isLoading || isQuotaExceeded}
          className="flex gap-2 items-center"
          size="sm"
        >
          <RefreshCw className="h-4 w-4" />
          Generate New Plan
        </Button>
      </div>

      <div className="space-y-3">
        {contentPlan.days.map((day, index) => (
          <div key={day.day} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-chichi-orange text-white flex items-center justify-center text-xs font-bold">
                {day.day}
              </div>
              <h3 className="text-base font-semibold flex-1">{day.title}</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Send to Calendar (Coming Soon)">
                <Calendar className="h-3 w-3 text-gray-400" />
              </Button>
            </div>
            
            <div className="space-y-2 ml-8">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Content Idea</h4>
                <p className="text-sm text-gray-700">{day.prompt}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Suggested Format</h4>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {day.format}
                </span>
              </div>
              
              <div className="bg-orange-50 border-l-2 border-chichi-orange p-2 rounded-r">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-3 w-3 text-chichi-orange mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-chichi-orange">ChiChi Tip</h4>
                    <p className="text-xs text-gray-700 mt-1">{day.chichiTip}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {index < contentPlan.days.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSaveToNotes}
          className="flex items-center gap-2 bg-chichi-purple hover:bg-chichi-purple-dark"
          size="sm"
        >
          <StickyNote className="h-4 w-4" />
          Save to Notes
        </Button>
        
        <div className="p-3 bg-blue-50 rounded-lg flex-1">
          <h3 className="font-semibold text-blue-900 mb-1 text-sm">Content Plan Ready!</h3>
          <p className="text-xs text-blue-700">
            Your 7-day content strategy is complete. Save it to notes to keep track of your planned content and reference it anytime.
          </p>
        </div>
      </div>
    </Card>
  );
}
