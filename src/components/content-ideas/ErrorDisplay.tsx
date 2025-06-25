
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorDisplayProps {
  apiError: string | null;
  isQuotaExceeded: boolean;
}

export function ErrorDisplay({ apiError, isQuotaExceeded }: ErrorDisplayProps) {
  if (!apiError && !isQuotaExceeded) return null;

  if (isQuotaExceeded) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>OpenAI API Quota Exceeded</AlertTitle>
        <AlertDescription>
          Your OpenAI API key has reached its quota limit. Please check your billing details on the 
          OpenAI website or try again later when your quota resets.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{apiError}</AlertDescription>
    </Alert>
  );
}
