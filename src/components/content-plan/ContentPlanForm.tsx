
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

export interface FormValues {
  audience: string;
  business: string;
  contentGoal: string;
  preferredFormats: string[];
  platforms: string[];
}

interface ContentPlanFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
  isQuotaExceeded: boolean;
}

export const contentGoalOptions = [
  { value: "grow-followers", label: "Grow followers" },
  { value: "build-trust", label: "Build trust" },
  { value: "promote-offer", label: "Promote an offer" },
  { value: "show-expertise", label: "Show expertise" },
  { value: "increase-engagement", label: "Increase engagement" },
  { value: "drive-sales", label: "Drive sales" },
  { value: "brand-awareness", label: "Build brand awareness" },
];

export const formatOptions = [
  { value: "reels", label: "Reels" },
  { value: "carousels", label: "Carousels" },
  { value: "stories", label: "Stories" },
  { value: "text-posts", label: "Text-only posts" },
  { value: "ugc", label: "User-generated content" },
  { value: "behind-scenes", label: "Behind-the-scenes" },
];

export const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter/X" },
  { value: "youtube", label: "YouTube" },
];

export function ContentPlanForm({ onSubmit, isLoading, isQuotaExceeded }: ContentPlanFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      audience: "",
      business: "",
      contentGoal: "",
      preferredFormats: [],
      platforms: [],
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
                  <Input placeholder="E.g., busy moms, new coaches, Black women in tech" {...field} />
                </FormControl>
                <FormDescription>
                  Be specific about who you create content for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business"
            rules={{ required: "Please describe what you do" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you do or sell?</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., skincare, coaching, art, UGC, events" {...field} />
                </FormControl>
                <FormDescription>
                  Your business, service, or what you offer
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
                <FormLabel>What's your current goal with content?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your main content goal" />
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
                  Your primary objective for this week's content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredFormats"
            render={() => (
              <FormItem>
                <FormLabel>Do you have any content formats you prefer?</FormLabel>
                <FormDescription>
                  Select the formats you like to create (optional)
                </FormDescription>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {formatOptions.map((format) => (
                    <FormField
                      key={format.value}
                      control={form.control}
                      name="preferredFormats"
                      render={({ field }) => (
                        <FormItem
                          key={format.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(format.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, format.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== format.value
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {format.label}
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
            name="platforms"
            rules={{ 
              validate: (value) => value.length > 0 || "Please select at least one platform" 
            }}
            render={() => (
              <FormItem>
                <FormLabel>What platforms are you posting on this week?</FormLabel>
                <FormDescription>
                  Select where you'll be sharing your content
                </FormDescription>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {platformOptions.map((platform) => (
                    <FormField
                      key={platform.value}
                      control={form.control}
                      name="platforms"
                      render={({ field }) => (
                        <FormItem
                          key={platform.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(platform.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, platform.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== platform.value
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {platform.label}
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
                <Calendar className="h-4 w-4" />
                Generate 7-Day Content Plan
              </>
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
