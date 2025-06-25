
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Settings } from 'lucide-react';
import { useContentPlanGenerator } from '@/hooks/useContentPlanGenerator';
import { ContentPlanDisplay } from '@/components/content-plan/ContentPlanDisplay';
import { useCalendarTasks } from '@/hooks/useCalendarTasks';
import { EnhancedContentPlanForm, EnhancedFormValues } from '@/components/content-plan/EnhancedContentPlanForm';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function ContentGeneratorSection() {
  const { generateContentPlan, ...generatorState } = useContentPlanGenerator();
  const { addTask } = useCalendarTasks();
  const [showForm, setShowForm] = useState(false);

  const handleGenerateWithForm = (formValues: EnhancedFormValues) => {
    // Convert enhanced form values to the format expected by the generator
    const convertedValues = {
      audience: formValues.targetAudience,
      business: `${formValues.contentNiche} content creator`,
      contentGoal: formValues.mainGoal,
      preferredFormats: formValues.preferredContentTypes,
      platforms: [formValues.platform]
    };
    generateContentPlan(convertedValues);
    setShowForm(false);
  };

  const handleTryAgain = () => {
    // For try again, we'll need the user to use the form again
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {/* AI Content Generator Card */}
      <Card className="border border-chichi-purple/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-chichi-orange" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate a strategic 7-day content plan with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Sheet open={showForm} onOpenChange={setShowForm}>
            <SheetTrigger asChild>
              <Button
                disabled={generatorState.isLoading}
                variant="default"
                className="w-full"
              >
                <Settings className="mr-2 h-4 w-4" />
                Generate Custom Content Plan
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Create Your Custom Content Plan</SheetTitle>
                <SheetDescription>
                  Fill out the form below to generate a personalized 7-day content strategy
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <EnhancedContentPlanForm
                  onSubmit={handleGenerateWithForm}
                  isLoading={generatorState.isLoading}
                  isQuotaExceeded={generatorState.isQuotaExceeded}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          {generatorState.isQuotaExceeded && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ✨ You've reached your daily AI generation limit. More generations available tomorrow!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Plan Display */}
      {generatorState.contentPlan && (
        <ContentPlanDisplay
          contentPlan={generatorState.contentPlan}
          onTryAgain={handleTryAgain}
          isLoading={generatorState.isLoading}
          isQuotaExceeded={generatorState.isQuotaExceeded}
        />
      )}
    </div>
  );
}
