
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Calendar } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export interface EnhancedFormValues {
  contentNiche: string;
  platform: string;
  targetAudience: string;
  mainGoal: string;
  preferredContentTypes: string[];
  brandTone: string;
  audienceChallenges: string;
}

interface EnhancedContentPlanFormProps {
  onSubmit: (values: EnhancedFormValues) => void;
  isLoading: boolean;
  isQuotaExceeded: boolean;
}

export const contentNicheOptions = [
  { value: "fitness-health", label: "Fitness & Health" },
  { value: "business-entrepreneurship", label: "Business & Entrepreneurship" },
  { value: "lifestyle-fashion", label: "Lifestyle & Fashion" },
  { value: "food-cooking", label: "Food & Cooking" },
  { value: "travel", label: "Travel" },
  { value: "technology", label: "Technology" },
  { value: "education-tutorials", label: "Education & Tutorials" },
  { value: "entertainment", label: "Entertainment" },
  { value: "art-design", label: "Art & Design" },
  { value: "personal-development", label: "Personal Development" },
  { value: "other", label: "Other" },
];

export const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "multiple", label: "Multiple Platforms" },
];

export const mainGoalOptions = [
  { value: "increase-engagement", label: "Increase engagement" },
  { value: "grow-followers", label: "Grow followers" },
  { value: "drive-sales", label: "Drive sales/conversions" },
  { value: "build-awareness", label: "Build brand awareness" },
  { value: "educate-audience", label: "Educate audience" },
  { value: "launch-product", label: "Launch new product/service" },
];

export const contentTypeOptions = [
  { value: "educational", label: "Educational posts" },
  { value: "behind-scenes", label: "Behind-the-scenes" },
  { value: "tips-tutorials", label: "Tips & tutorials" },
  { value: "personal-stories", label: "Personal stories" },
  { value: "product-showcases", label: "Product showcases" },
  { value: "ugc", label: "User-generated content" },
  { value: "trending-topics", label: "Trending topics" },
  { value: "qa-sessions", label: "Q&A sessions" },
];

export const brandToneOptions = [
  { value: "professional", label: "Professional & Authoritative" },
  { value: "friendly", label: "Friendly & Conversational" },
  { value: "fun", label: "Fun & Playful" },
  { value: "inspirational", label: "Inspirational & Motivational" },
  { value: "educational", label: "Educational & Informative" },
];

export function EnhancedContentPlanForm({ onSubmit, isLoading, isQuotaExceeded }: EnhancedContentPlanFormProps) {
  const form = useForm<EnhancedFormValues>({
    defaultValues: {
      contentNiche: "",
      platform: "",
      targetAudience: "",
      mainGoal: "",
      preferredContentTypes: [],
      brandTone: "",
      audienceChallenges: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = (values: EnhancedFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="contentNiche"
            rules={{ required: "Please select your content niche" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Content Niche</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select your content niche" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contentNicheOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platform"
            rules={{ required: "Please select your platform" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select your main platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {platformOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudience"
            rules={{ required: "Please describe your target audience" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Target Audience</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your target audience - who are they, what are their interests, demographics, etc."
                    className="min-h-[60px] text-sm"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Be specific about who you create content for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mainGoal"
            rules={{ required: "Please select your main goal" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Main Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="What's your primary goal?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mainGoalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredContentTypes"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm">Preferred Content Types</FormLabel>
                <FormDescription className="text-xs">
                  Select the types of content you like to create (optional)
                </FormDescription>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {contentTypeOptions.map((type) => (
                    <FormField
                      key={type.value}
                      control={form.control}
                      name="preferredContentTypes"
                      render={({ field }) => (
                        <FormItem
                          key={type.value}
                          className="flex flex-row items-start space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, type.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== type.value
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-xs">
                            {type.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brandTone"
            rules={{ required: "Please select your brand tone" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Brand Tone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="How do you communicate with your audience?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brandToneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="audienceChallenges"
            rules={{ required: "Please describe your audience's challenges" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Audience Challenges</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What problems or challenges does your audience face that your content can help solve?"
                    className="min-h-[60px] text-sm"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Understanding their pain points helps create more targeted content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isLoading || isQuotaExceeded}
            className="flex gap-2 items-center w-full h-8 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Generating Your 7-Day Plan...
              </>
            ) : (
              <>
                <Calendar className="h-3 w-3" />
                Generate My 7-Day Content Plan
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
