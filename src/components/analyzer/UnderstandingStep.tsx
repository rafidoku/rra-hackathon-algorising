import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UnderstandingResult } from "@/pages/Analyzer";

interface UnderstandingStepProps {
  onComplete: (data: UnderstandingResult) => void;
}

const UnderstandingStep = ({ onComplete }: UnderstandingStepProps) => {
  const [technicalNotes, setTechnicalNotes] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [analysis, setAnalysis] = useState<UnderstandingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeUnderstanding = async () => {
    if (!technicalNotes.trim() && !acceptanceCriteria.trim()) {
      toast({
        title: "Input required",
        description: "Please enter technical notes or acceptance criteria",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-understanding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          technicalNotes,
          acceptanceCriteria,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze");
      }

      const data = await response.json();
      setAnalysis(data);
      onComplete(data);

      toast({
        title: "Analysis complete",
        description: "Understanding analysis completed successfully",
      });
    } catch (error) {
      console.error("Error analyzing:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 shadow-lg border-2">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Technical Notes (TL)
              </h2>
              <p className="text-sm text-muted-foreground">JIRA tickets, commit messages</p>
            </div>
            <Textarea
              placeholder="Example:
• Implemented payment gateway integration
• Refactored authentication flow
• Added rate limiting to API endpoints"
              value={technicalNotes}
              onChange={(e) => setTechnicalNotes(e.target.value)}
              className="min-h-[150px] text-base font-mono resize-none"
            />
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Acceptance Criteria (PM)
              </h2>
              <p className="text-sm text-muted-foreground">Product requirements</p>
            </div>
            <Textarea
              placeholder="Example:
• User can select payment method
• System validates payment details
• Success message after payment"
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              className="min-h-[150px] text-base font-mono resize-none"
            />
          </div>
        </div>

        <Button
          onClick={analyzeUnderstanding}
          disabled={isLoading || (!technicalNotes.trim() && !acceptanceCriteria.trim())}
          className="w-full mt-6 h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Understanding
            </>
          )}
        </Button>
      </Card>

      {/* Output Section */}
      {(isLoading || analysis) && (
        <div className="space-y-6">
          {/* Feature Summary */}
          <Card className="p-6 shadow-lg border-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Feature Summary
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Generating summary...</span>
                </div>
              ) : (
                <p className="text-base leading-relaxed whitespace-pre-wrap">{analysis?.featureSummary}</p>
              )}
            </div>
          </Card>

          {/* Missing Requirements */}
          <Card className="p-6 shadow-lg border-2 border-destructive/20">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                Missing or Unclear Requirements
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                  <span className="text-sm text-muted-foreground">Analyzing gaps...</span>
                </div>
              ) : analysis?.missingRequirements && analysis.missingRequirements.length > 0 ? (
                <div className="space-y-3">
                  {analysis.missingRequirements.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-destructive/5 rounded-lg p-3">
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No major gaps detected</p>
              )}
            </div>
          </Card>

          {/* Expected Outcomes */}
          <Card className="p-6 shadow-lg border-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                Expected Outcomes
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground">Extracting outcomes...</span>
                </div>
              ) : analysis?.expectedOutcomes && analysis.expectedOutcomes.length > 0 ? (
                <div className="space-y-2">
                  {analysis.expectedOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3 bg-background rounded-lg p-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{outcome}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No outcomes extracted yet</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UnderstandingStep;
