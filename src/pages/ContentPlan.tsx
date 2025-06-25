
import { useContentPlanGenerator } from "@/hooks/useContentPlanGenerator";
import { ContentPlanForm, FormValues } from "@/components/content-plan/ContentPlanForm";
import { ContentPlanDisplay } from "@/components/content-plan/ContentPlanDisplay";
import { ErrorDisplay } from "@/components/content-ideas/ErrorDisplay";

export default function ContentPlan() {
  const {
    isLoading,
    contentPlan,
    apiError,
    isQuotaExceeded,
    generateContentPlan,
    handleTryAgain,
  } = useContentPlanGenerator();

  const handleSubmit = (values: FormValues) => {
    generateContentPlan(values);
  };

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">7-Day Content Plan Generator</h1>
        <p className="text-muted-foreground mt-2">
          Get a strategic 7-day content plan tailored to your business, audience, and goals.
        </p>
      </div>

      <ErrorDisplay 
        apiError={apiError} 
        isQuotaExceeded={isQuotaExceeded} 
      />

      <ContentPlanForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        isQuotaExceeded={isQuotaExceeded} 
      />

      {contentPlan && (
        <ContentPlanDisplay 
          contentPlan={contentPlan}
          onTryAgain={handleTryAgain}
          isLoading={isLoading}
          isQuotaExceeded={isQuotaExceeded}
        />
      )}
    </div>
  );
}
