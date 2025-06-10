import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const featureOptions = [
  { label: "Product Listing", value: "product_listing" },
  { label: "Order Management", value: "order_management" },
  { label: "Payments", value: "payments" },
  { label: "Reports & Analytics", value: "reports_analytics" },
  { label: "Notifications", value: "notifications" },
  { label: "Account Settings", value: "account_settings" },
  { label: "Others", value: "others" },
];

const formSchema = z.object({
  feature: z.string().min(1, { message: "Please select a feature." }),
  otherFeature: z.string().optional(),
  feedback: z
    .string()
    .min(10, { message: "Feedback must be at least 10 characters." }),
  anonymous: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const Feedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feature: "",
      otherFeature: "",
      feedback: "",
      anonymous: false,
    },
  });

  // Watch feature selection for conditional rendering
  const featureValue = form.watch("feature");

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
    <div>
      <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Share Your Feedback</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Feature selection */}
            <FormField
              control={form.control}
              name="feature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Feature <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border rounded-lg text-base"
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedFeature(e.target.value);
                        // Reset otherFeature if not others
                        if (e.target.value !== "others") {
                          form.setValue("otherFeature", "");
                        }
                      }}
                      value={field.value}
                    >
                      <option value="">Select Feature</option>
                      {featureOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* If "Others" is selected, show free text input */}
            {form.watch("feature") === "others" && (
              <FormField
                control={form.control}
                name="otherFeature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Please specify the feature{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg text-base"
                        placeholder="Enter feature name"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            )}

            {/* Feedback message */}
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
                      className="min-h-[30px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="gradient-border button-bg text-white  py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Feedback;
