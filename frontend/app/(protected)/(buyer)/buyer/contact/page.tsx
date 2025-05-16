"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  MessageSquare,
  UserX,
  CheckCircle,
  ThumbsUp,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <div className=" bg-gray-50 rounded-md">
      {/* Header */}
      <header className="bg-gray-50 px-5 py-12 rounded-md">
        <div className="max-w-7xl ">
          <h1 className="text-4xl font-bold mb-4 flex items-center text-gray-900">
            <MessageSquare className="h-8 w-8 mr-3" />
            Customer Feedback Center
          </h1>
          <p className="text-xl max-w-3xl text-gray-600">
            Your opinions help us improve. Share your thoughts, suggestions, and
            experiences to help us serve you better.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="w-full px-5 py-12 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column - Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Share Your Feedback</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Your Feedback <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience, suggestions, or ideas for improvement..."
                          className="min-h-[200px] text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="gradient-border button-bg text-white w-full py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Right column - Additional content */}
          <div className="space-y-8">
            {/* Why your feedback matters */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <ThumbsUp className="h-5 w-5 mr-2 text-gray-700" />
                Why Your Feedback Matters
              </h3>
              <ul className="space-y-3">
                {[
                  "Helps us identify areas for improvement",
                  "Shapes our product roadmap and future features",
                  "Allows us to better understand your needs",
                  "Contributes to a better experience for all users",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-gray-700" />
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is my feedback anonymous?</AccordionTrigger>
                  <AccordionContent>
                    Your feedback is only anonymous if you toggle the "Submit
                    Anonymously" option. Otherwise, it will be associated with
                    your account to help us better address your specific
                    concerns.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How is my feedback used?</AccordionTrigger>
                  <AccordionContent>
                    Your feedback is reviewed by our product team and used to
                    identify areas for improvement, prioritize new features, and
                    enhance the overall user experience.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Will I receive a response?
                  </AccordionTrigger>
                  <AccordionContent>
                    While we may not respond to every piece of feedback
                    individually, we do review all submissions. For specific
                    issues requiring attention, our support team may reach out
                    to you directly.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Success stories */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-700" />
                Feedback Success Stories
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-gray-500 pl-4 py-2">
                  <p className="italic text-gray-600">
                    "Based on user feedback, we implemented the dark mode
                    feature that is now used by over 70% of our users."
                  </p>
                </div>
                <div className="border-l-4 border-gray-400 pl-4 py-2">
                  <p className="italic text-gray-600">
                    "Multiple users suggested improvements to our navigation
                    system, leading to a complete redesign that reduced support
                    tickets by 35%."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
