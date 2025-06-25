
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export interface FormValues {
  audience: string;
  niche: string;
  contentGoal: string;
}

interface ContentIdeaFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
  isQuotaExceeded: boolean;
}

export const contentGoalOptions = [
  { value: "educate", label: "Educate audience" },
  { value: "build-trust", label: "Build trust" },
  { value: "show-personality", label: "Show personality" },
  { value: "promote-offer", label: "Promote offer" },
  { value: "share-transformation", label: "Share transformation" },
  { value: "start-conversation", label: "Start conversation" },
];

export function ContentIdeaForm({ onSubmit, isLoading, isQuotaExceeded }: ContentIdeaFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      audience: "",
      niche: "",
      contentGoal: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="audience"
            rules={{ required: "Please describe your audience" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who is your audience?</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Small business owners, fitness enthusiasts" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the people you create content for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="niche"
            rules={{ required: "Please describe what you do" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you do?</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Social media marketing, yoga coaching" {...field} />
                </FormControl>
                <FormDescription>
                  Your niche, expertise, or offer
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contentGoal"
            rules={{ required: "Please select a content goal" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a content goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contentGoalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  What you want to achieve with this content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isLoading || isQuotaExceeded}
            className="flex gap-2 items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Content Idea
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
