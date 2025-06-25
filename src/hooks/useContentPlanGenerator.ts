
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormValues } from "@/components/content-plan/ContentPlanForm";
import { ContentPlan } from "@/components/content-plan/ContentPlanDisplay";
import { ContentIdea } from "@/components/content-ideas/ContentIdeaDisplay";

export function useContentPlanGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [contentPlan, setContentPlan] = useState<ContentPlan | null>(null);
  const [contentIdea, setContentIdea] = useState<ContentIdea | null>(null);
  const [lastFormValues, setLastFormValues] = useState<FormValues | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  const generateContentPlan = async (formValues?: FormValues) => {
    // Use default values if no form values provided
    const defaultFormValues: FormValues = {
      audience: "Content creators and social media managers",
      business: "Social media content creation",
      contentGoal: "educate",
      preferredFormats: ["carousel", "video"],
      platforms: ["instagram"]
    };

    const values = formValues || lastFormValues || defaultFormValues;
    
    setIsLoading(true);
    setLastFormValues(values);
    setApiError(null);
    setIsQuotaExceeded(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-content-plan", {
        body: values,
      });

      if (error) {
        throw new Error(error.message || "Failed to generate content plan");
      }
      
      if (data.error) {
        if (data.errorType === "quota_exceeded") {
          setIsQuotaExceeded(true);
          throw new Error(data.error);
        }
        throw new Error(data.error);
      }

      setContentPlan(data as ContentPlan);
      setContentIdea(null); // Clear content idea when generating plan
      toast({
        title: "Content plan generated!",
        description: "Your 7-day content plan is ready.",
      });
    } catch (error) {
      console.error("Error generating content plan:", error);
      setApiError(error instanceof Error ? error.message : "Failed to generate content plan");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateContentIdea = async (formValues?: FormValues) => {
    // Use default values if no form values provided
    const defaultFormValues = {
      audience: "Content creators and social media managers",
      niche: "Social media content creation",
      contentGoal: "educate"
    };

    const values = formValues || defaultFormValues;
    
    setIsLoading(true);
    setApiError(null);
    setIsQuotaExceeded(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-content-ideas", {
        body: values,
      });

      if (error) {
        throw new Error(error.message || "Failed to generate content idea");
      }
      
      if (data.error) {
        if (data.errorType === "quota_exceeded") {
          setIsQuotaExceeded(true);
          throw new Error(data.error);
        }
        throw new Error(data.error);
      }

      setContentIdea(data as ContentIdea);
      setContentPlan(null); // Clear content plan when generating idea
      toast({
        title: "Content idea generated!",
        description: "Your content idea is ready.",
      });
    } catch (error) {
      console.error("Error generating content idea:", error);
      setApiError(error instanceof Error ? error.message : "Failed to generate content idea");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content idea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    if (contentPlan && lastFormValues) {
      generateContentPlan(lastFormValues);
    } else if (contentIdea) {
      generateContentIdea();
    }
  };

  return {
    isLoading,
    contentPlan,
    contentIdea,
    apiError,
    isQuotaExceeded,
    generateContentPlan,
    generateContentIdea,
    handleTryAgain,
  };
}
