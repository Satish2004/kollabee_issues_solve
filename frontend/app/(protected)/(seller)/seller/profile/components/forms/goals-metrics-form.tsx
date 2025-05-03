"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const objectives = [
  "Expand your buyer network",
  "Vegan Products",
  "Organic Ingredients",
  "Small-Batch Production",
];

const challenges = [
  "Eco-Friendly Practices",
  "Vegan Products",
  "Organic Ingredients",
  "Small-Batch Production",
];

const metrics = [
  "Small Businesses",
  "Startups & Entrepreneurs",
  "Established Brands",
  "Regional Buyers",
];

type GoalsMetricsFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
};

const GoalsMetricsForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
}: GoalsMetricsFormProps) => {
  const handleObjectiveToggle = (objective: string) => {
    onChange({
      ...formState,
      selectedObjectives: formState.selectedObjectives?.includes(objective)
        ? formState.selectedObjectives.filter((o: string) => o !== objective)
        : [...(formState.selectedObjectives || []), objective].slice(0, 3),
    });
  };

  const handleChallengeToggle = (challenge: string) => {
    onChange({
      ...formState,
      selectedChallenges: formState.selectedChallenges?.includes(challenge)
        ? formState.selectedChallenges.filter((c: string) => c !== challenge)
        : [...(formState.selectedChallenges || []), challenge].slice(0, 3),
    });
  };

  const handleMetricToggle = (metric: string) => {
    onChange({
      ...formState,
      selectedMetrics: formState.selectedMetrics?.includes(metric)
        ? formState.selectedMetrics.filter((m: string) => m !== metric)
        : [...(formState.selectedMetrics || []), metric].slice(0, 3),
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-bold">
            What Do You Aim to Achieve with KollaBee?
          </h3>
          <p className="text-sm text-muted-foreground">
            [Choose up to 3 options that best describe your goals.]
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {objectives.map((objective) => (
              <div key={objective} className="flex items-start space-x-3">
                <Checkbox
                  id={`objective-${objective}`}
                  checked={formState.selectedObjectives?.includes(objective)}
                  onCheckedChange={() => handleObjectiveToggle(objective)}
                  disabled={
                    !formState.selectedObjectives?.includes(objective) &&
                    (formState.selectedObjectives?.length || 0) >= 3
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
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            [Help us understand your pain points to provide better support.]
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {challenges.map((challenge) => (
              <div key={challenge} className="flex items-start space-x-3">
                <Checkbox
                  id={`challenge-${challenge}`}
                  checked={formState.selectedChallenges?.includes(challenge)}
                  onCheckedChange={() => handleChallengeToggle(challenge)}
                  disabled={
                    !formState.selectedChallenges?.includes(challenge) &&
                    (formState.selectedChallenges?.length || 0) >= 3
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
            <span className="text-red-500">*</span>
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
                  checked={formState.selectedMetrics?.includes(metric)}
                  onCheckedChange={() => handleMetricToggle(metric)}
                  disabled={
                    !formState.selectedMetrics?.includes(metric) &&
                    (formState.selectedMetrics?.length || 0) >= 3
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
            Agreement Statement: <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreement"
              checked={formState.agreement}
              onCheckedChange={(checked) =>
                onChange({
                  ...formState,
                  agreement: checked as boolean,
                })
              }
            />
            <label
              htmlFor="agreement"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              By submitting this form, I give Kollabee permission to store my
              contact details and share updates about relevant buyers and market
              opportunities.
            </label>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default GoalsMetricsForm;
