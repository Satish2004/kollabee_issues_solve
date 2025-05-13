"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, UserX } from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const formSchema = z.object({
  feedback: z
    .string()
    .min(10, { message: "Feedback must be at least 10 characters." }),
  anonymous: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const FeedbackPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
      anonymous: false,
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      console.log("Feedback data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        "Feedback submitted! Thank you for your feedback. We appreciate your input!"
      );

      // Reset form
      form.reset();
    } catch (error) {
      toast.error(
        "Something went wrong. Your feedback couldn't be submitted. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full rounded-lg px-7 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Share Your Feedback
          </CardTitle>
          <CardDescription>
            We value your opinion! Let us know what you think about our service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Your Feedback <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience, suggestions, or ideas for improvement..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2">
                        <UserX className="h-4 w-4" />
                        Submit Anonymously
                      </FormLabel>
                      <FormDescription>
                        Your identity will not be associated with this feedback
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="gradient-border button-bg text-white w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
