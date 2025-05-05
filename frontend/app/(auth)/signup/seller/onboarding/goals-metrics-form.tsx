"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const objectives = [
  "Expand into new markets",
  "Connect with high-quality buyers",
  "Increase brand visibility",
  "Build relationships with startups or emerging brands",
  "Promote sustainable or ethical practices",
  "Grow export volume",
];

const challenges = [
  "Difficulty reaching serious buyers",
  "Low brand visibility",
  "Price pressure and margin squeeze",
  "Long lead times for closing deals",
  "Managing small batch/MOQ efficiently",
  "Complex compliance or certification demands",
];

const metrics = [
  "Number of quality leads",
  "Volume/value of confirmed orders",
  "New market penetration",
  "Repeat buyers and customer loyalty",
  "Brand visibility and recognition",
  "Speed of response and deal closure",
];

interface GoalsMetricsFormProps {
  formData: {
    selectedObjectives: string[];
    selectedChallenges: string[];
    selectedMetrics: string[];
    agreement1: boolean;
    agreement2: boolean;
  };
  setFormData: (
    data: (
      prev: GoalsMetricsFormProps["formData"]
    ) => GoalsMetricsFormProps["formData"]
  ) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export function GoalsMetricsForm({
  formData,
  setFormData,
  onSubmit,
  onPrevious,
  isSubmitting,
}: GoalsMetricsFormProps) {
  const handleObjectiveToggle = (objective: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedObjectives: prev.selectedObjectives.includes(objective)
        ? prev.selectedObjectives.filter((o) => o !== objective)
        : [...prev.selectedObjectives, objective].slice(0, 3),
    }));
  };

  const handleChallengeToggle = (challenge: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedChallenges: prev.selectedChallenges.includes(challenge)
        ? prev.selectedChallenges.filter((c) => c !== challenge)
        : [...prev.selectedChallenges, challenge].slice(0, 3),
    }));
  };

  const handleMetricToggle = (metric: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedMetrics: prev.selectedMetrics.includes(metric)
        ? prev.selectedMetrics.filter((m) => m !== metric)
        : [...prev.selectedMetrics, metric].slice(0, 3),
    }));
  };

  const isFormValid = () => {
    return (
      formData.selectedObjectives.length > 0 &&
      formData.selectedChallenges.length > 0 &&
      formData.selectedMetrics.length > 0 &&
      formData.agreement1 &&
      formData.agreement2
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-start space-y-2">
        <h2 className="text-2xl font-bold">Goals and Metrics</h2>
        <p className="text-muted-foreground">
          Help us understand your priorities so we can tailor the platform to
          your needs.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-bold">What are your main goals on KollaBee?</h3>
          <p className="text-sm text-muted-foreground">
            [Choose up to 3 options that best describe your goals.]
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {objectives.map((objective) => (
              <div key={objective} className="flex items-start space-x-3">
                <Checkbox
                  id={`objective-${objective}`}
                  checked={formData.selectedObjectives.includes(objective)}
                  onCheckedChange={() => handleObjectiveToggle(objective)}
                  disabled={
                    !formData.selectedObjectives.includes(objective) &&
                    formData.selectedObjectives.length >= 3
                  }
                />
                <label
                  htmlFor={`objective-${objective}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {objective}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold">
            What Challenges Are You Looking to Overcome?{" "}
            <span className="text-destructive">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            [Help us understand your pain points to provide better support.]
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {challenges.map((challenge) => (
              <div key={challenge} className="flex items-start space-x-3">
                <Checkbox
                  id={`challenge-${challenge}`}
                  checked={formData.selectedChallenges.includes(challenge)}
                  onCheckedChange={() => handleChallengeToggle(challenge)}
                  disabled={
                    !formData.selectedChallenges.includes(challenge) &&
                    formData.selectedChallenges.length >= 3
                  }
                />
                <label
                  htmlFor={`challenge-${challenge}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {challenge}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold">
            What Success Metrics Matter Most to You?{" "}
            <span className="text-destructive">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            [Select the metrics you value the most in evaluating KollaBee's
            impact.]
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div key={metric} className="flex items-start space-x-3">
                <Checkbox
                  id={`metric-${metric}`}
                  checked={formData.selectedMetrics.includes(metric)}
                  onCheckedChange={() => handleMetricToggle(metric)}
                  disabled={
                    !formData.selectedMetrics.includes(metric) &&
                    formData.selectedMetrics.length >= 3
                  }
                />
                <label
                  htmlFor={`metric-${metric}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {metric}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold">
            Agreement Statement: <span className="text-destructive">*</span>
          </h3>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreement1"
              checked={formData.agreement1}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  agreement1: checked as boolean,
                }))
              }
            />
            <label
              htmlFor="agreement1"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to KollaBee’s Terms & Conditions and Privacy Policy.
            </label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreement2"
              checked={formData.agreement2}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  agreement2: checked as boolean,
                }))
              }
            />
            <label
              htmlFor="agreement2"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I give Kollabee permission to store my contact details and share
              updates about relevant buyers and market opportunities.
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button
          onClick={onPrevious}
          variant="ghost"
          size="sm"
          className="text-primary -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          className="rounded-[6px] text-white px-8 py-2  bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
          disabled={!isFormValid() || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
