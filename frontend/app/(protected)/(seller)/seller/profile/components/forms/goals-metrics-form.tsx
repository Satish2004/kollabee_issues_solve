"use client";

import { Button } from "@/components/ui/button";
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
  console.log("formState : ", formState);
  const handleObjectiveToggle = (objective: string) => {
    onChange({
      ...formState,
      selectedObjectives: formState.selectedObjectives?.includes(objective)
        ? formState.selectedObjectives.filter((o: string) => o !== objective)
        : [...(formState.selectedObjectives || []), objective],
    });
  };

  const handleChallengeToggle = (challenge: string) => {
    onChange({
      ...formState,
      selectedChallenges: formState.selectedChallenges?.includes(challenge)
        ? formState.selectedChallenges.filter((c: string) => c !== challenge)
        : [...(formState.selectedChallenges || []), challenge],
    });
  };

  const handleMetricToggle = (metric: string) => {
    onChange({
      ...formState,
      selectedMetrics: formState.selectedMetrics?.includes(metric)
        ? formState.selectedMetrics.filter((m: string) => m !== metric)
        : [...(formState.selectedMetrics || []), metric],
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="">
          <h3 className="font-bold">
            1. What are your main goals on KollaBee? (Choose up to 3)
          </h3>
          <p className="text-sm font-futura italic">
            Select up to 3 goals that best reflect what you're hoping to achieve
            on the platform.
          </p>
          <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 gap-3">
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

        <div className="">
          <h3 className="font-bold">
            2. What challenges are you looking to overcome? (Select all that
            apply) <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm font-futura italic">
            Select the most relevant challenges you face in your current
            operations or sales strategy.
          </p>
          <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 gap-3">
            {challenges.map((challenge) => (
              <div key={challenge} className="flex items-start space-x-3">
                <Checkbox
                  id={`challenge-${challenge}`}
                  checked={formState.selectedChallenges?.includes(challenge)}
                  onCheckedChange={() => handleChallengeToggle(challenge)}
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

        <div className="">
          <h3 className="font-bold">
            3. What success metrics matter most to you? (Select your top 3){" "}
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-muted-foreground font-futura italic">
            Select the metrics you value the most to evaluate your success on
            KollaBee.
          </p>
          <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 gap-3">
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
              id="agreement1"
              checked={formState.agreement1}
              onCheckedChange={(checked) =>
                onChange({
                  ...formState,
                  agreement1: checked as boolean,
                })
              }
            />
            <label
              htmlFor="agreement1"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to KollaBee’s{" "}
              <a
                href="/terms-conditions"
                target="_blank"
                className="text-blue-500"
              >
                {" "}
                Terms & Conditions{" "}
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                className="text-blue-500"
              >
                {" "}
                Privacy Policy.
              </a>
            </label>
          </div>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreement"
              checked={formState.agreement2}
              onCheckedChange={(checked) =>
                onChange({
                  ...formState,
                  agreement2: checked as boolean,
                })
              }
            />
            <label
              htmlFor="agreement"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I give KollaBee permission to store my business information and
              send updates about relevant buyers, opportunities, and platform
              features.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsMetricsForm;
