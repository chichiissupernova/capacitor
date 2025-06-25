
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteIcon } from 'lucide-react';

// Array of motivational quotes for content creators
const motivationalQuotes = [
  "Creators who show up today, grow tomorrow.",
  "Post something imperfect — progress over polish.",
  "One post today = one step closer to your goals.",
  "The only content that fails is the one you never post.",
  "You don't need to go viral — you just need to be visible."
];

export const TodaysMotivation = () => {
  const [quote, setQuote] = useState<string>("");
  
  useEffect(() => {
    // Get today's date to use as a seed for selecting quotes
    const today = new Date();
    // Calculate day of year using getTime() to properly convert dates to numbers
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    // Use the day of the year to pick a quote, ensuring it changes daily
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <QuoteIcon className="h-5 w-5 text-chichi-purple mr-2" />
          Today's Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/20 p-6 rounded-lg flex items-center justify-center min-h-[100px]">
          <p className="text-xl font-medium text-center text-foreground italic">
            "{quote}"
          </p>
        </div>
        
        {/* Extra space to match the height of the previous component */}
        <div className="text-sm mt-6 text-muted-foreground">
          <p>Stay consistent with your content to build your audience.</p>
        </div>
      </CardContent>
    </Card>
  );
};
