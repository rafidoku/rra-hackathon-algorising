import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UnderstandingResult, TestValidationResult, RecommendationResult } from "@/pages/Analyzer";
import { Progress } from "@/components/ui/progress";

interface RecommendationStepProps {
  understandingData: UnderstandingResult | null;
  testValidationData: TestValidationResult | null;
}

const RecommendationStep = ({ understandingData, testValidationData }: RecommendationStepProps) => {
  const [testResults, setTestResults] = useState("");
  const [analysis, setAnalysis] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendation = async () => {
    if (!understandingData || !testValidationData) {
      toast({
        title: "Complete previous steps first",
        description: "Please complete Understanding and Test Validation steps",
        variant: "destructive",
      });
      return;
    }

    if (!testResults.trim()) {
      toast({
        title: "Input required",
        description: "Please enter QA test results",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          understandingData,
          testValidationData,
          testResults,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const data = await response.json();
      setAnalysis(data);

      toast({
        title: "Analysis complete",
        description: "Release readiness report generated successfully",
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Ready to Release";
    if (score >= 60) return "Needs Minor Improvements";
    return "Not Ready - Action Required";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 shadow-lg border-2">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">QA Test Results</h2>
          <p className="text-sm text-muted-foreground">
            Provide the results from your QA testing to generate a comprehensive readiness report
          </p>
        </div>
        <Textarea
          placeholder="Example:
Test Execution Summary:
- Total tests: 45
- Passed: 42
- Failed: 3
- Blocked: 0

Failed Tests:
1. Payment with expired card - 500 error returned
2. Rate limiting not working on /api/auth
3. Missing validation on email field

Notes:
- All critical path tests passed
- Performance tests show acceptable response times
- Security scan completed with no critical issues"
          value={testResults}
          onChange={(e) => setTestResults(e.target.value)}
          className="min-h-[300px] text-base font-mono resize-none"
        />

        <Button
          onClick={generateRecommendation}
          disabled={isLoading || !testResults.trim() || !understandingData || !testValidationData}
          className="w-full mt-6 h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-5 w-5" />
              Generate Readiness Report
            </>
          )}
        </Button>
      </Card>

      {/* Output Section */}
      {(isLoading || analysis) && (
        <div className="space-y-6">
          {/* Readiness Score */}
          <Card className="p-6 shadow-lg border-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Release Readiness Score
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-6">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Calculating score...</span>
                </div>
              ) : analysis ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-5xl font-bold ${getScoreColor(analysis.readinessScore)}`}>
                      {analysis.readinessScore}%
                    </span>
                    <span className={`text-lg font-semibold ${getScoreColor(analysis.readinessScore)}`}>
                      {getScoreLabel(analysis.readinessScore)}
                    </span>
                  </div>
                  <Progress value={analysis.readinessScore} className="h-3" />
                </div>
              ) : null}
            </div>
          </Card>

          {/* Readiness Report */}
          <Card className="p-6 shadow-lg border-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Readiness Report
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Generating report...</span>
                </div>
              ) : (
                <p className="text-base leading-relaxed whitespace-pre-wrap">{analysis?.readinessReport}</p>
              )}
            </div>
          </Card>

          {/* Action Items */}
          <Card className="p-6 shadow-lg border-2 border-accent/20">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                Action Items
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground">Generating actions...</span>
                </div>
              ) : analysis?.actionItems && analysis.actionItems.length > 0 ? (
                <div className="space-y-3">
                  {analysis.actionItems.map((item, index) => {
                    const getPriorityColor = (priority: string) => {
                      if (priority.toLowerCase() === "high") return "text-destructive bg-destructive/10";
                      if (priority.toLowerCase() === "medium") return "text-yellow-600 bg-yellow-100";
                      return "text-accent bg-accent/10";
                    };

                    return (
                      <div key={index} className="flex items-start gap-3 bg-background rounded-lg p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <p className="text-sm leading-relaxed flex-1">{item.action}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No action items required</p>
              )}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 shadow-lg border-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-primary" />
                Detailed Recommendations
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Generating recommendations...</span>
                </div>
              ) : analysis?.recommendations && analysis.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 bg-background rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No additional recommendations</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecommendationStep;
