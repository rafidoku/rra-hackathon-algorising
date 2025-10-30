import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  featureSummary: string;
  missingRequirements: string[];
  expectedOutcomes: string[];
  testCases: string[];
}

const Index = () => {
  const [technicalNotes, setTechnicalNotes] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeRelease = async () => {
    if (!technicalNotes.trim() && !acceptanceCriteria.trim()) {
      toast({
        title: "Input required",
        description: "Please enter either technical notes or acceptance criteria",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-acceptance-criteria`, {
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
        throw new Error("Failed to analyze release");
      }

      const data = await response.json();
      setAnalysis(data);

      toast({
        title: "Analysis complete",
        description: "Release review completed successfully",
      });
    } catch (error) {
      console.error("Error analyzing release:", error);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            <span>DOKU AI-Powered Release Analyzer</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Release Review Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI reviews technical context and acceptance criteria to identify risks and generate test cases
          </p>
        </header>

        {/* Input Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="p-6 shadow-lg border-2">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Technical Notes */}
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Technical Notes (TL)
                  </h2>
                  <p className="text-sm text-muted-foreground">JIRA tickets, PR descriptions, commit messages</p>
                </div>
                <Textarea
                  placeholder="Example:
• Implemented new payment gateway integration
• Refactored authentication flow
• Added rate limiting to API endpoints
• Updated database schema for user profiles"
                  value={technicalNotes}
                  onChange={(e) => setTechnicalNotes(e.target.value)}
                  className="min-h-[200px] text-base font-mono resize-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Acceptance Criteria */}
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    Acceptance Criteria (PM)
                  </h2>
                  <p className="text-sm text-muted-foreground">Product requirements and expected behaviors</p>
                </div>
                <Textarea
                  placeholder="Example:
• User can select payment method from available options
• System validates payment details before processing
• Success message appears after successful payment
• Failed payments show clear error messages"
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  className="min-h-[200px] text-base font-mono resize-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <Button
              onClick={analyzeRelease}
              disabled={isLoading || (!technicalNotes.trim() && !acceptanceCriteria.trim())}
              className="w-full mt-6 h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Release...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Release
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Output Section */}
        {(isLoading || analysis) && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Feature Summary */}
            <Card className="p-6 shadow-lg border-2">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Feature Summary
                </h2>
                <p className="text-sm text-muted-foreground">AI-generated overview of what this release does</p>
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
                <p className="text-sm text-muted-foreground">Potential risks and gaps identified by AI</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                    <span className="text-sm text-muted-foreground">Analyzing for gaps...</span>
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
                <p className="text-sm text-muted-foreground">Structured list of what should happen</p>
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

            {/* Test Cases */}
            <Card className="p-6 shadow-lg border-2">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Recommended Test Cases
                </h2>
                <p className="text-sm text-muted-foreground">
                  Comprehensive test scenarios with step-by-step instructions
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Generating test cases...</p>
                    </div>
                  </div>
                ) : analysis?.testCases && analysis.testCases.length > 0 ? (
                  <div className="space-y-4">
                    {analysis.testCases.map((testCase, index) => (
                      <div
                        key={index}
                        className="bg-background rounded-lg p-4 shadow-sm border animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{testCase}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No test cases yet</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
