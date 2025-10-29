import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, TestTube2, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UnderstandingResult, TestValidationResult } from "@/pages/Analyzer";

interface TestValidationStepProps {
  understandingData: UnderstandingResult | null;
  onComplete: (data: TestValidationResult) => void;
}

const TestValidationStep = ({ understandingData, onComplete }: TestValidationStepProps) => {
  const [testCaseDocument, setTestCaseDocument] = useState("");
  const [analysis, setAnalysis] = useState<TestValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeTestValidation = async () => {
    if (!understandingData) {
      toast({
        title: "Complete Step 1 first",
        description: "Please complete the Understanding step before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (!testCaseDocument.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your test case document",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-test-validation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          understandingData,
          testCaseDocument,
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
        description: "Test validation completed successfully",
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
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Test Case Document</h2>
          <p className="text-sm text-muted-foreground">
            Paste your existing test cases to validate coverage against acceptance criteria
          </p>
        </div>
        <Textarea
          placeholder="Example:
Test Case 1: Verify payment gateway integration
Steps:
1. Navigate to checkout
2. Select payment method
3. Enter valid card details
Expected: Payment processes successfully

Test Case 2: Validate error handling
Steps:
1. Enter invalid card
2. Submit payment
Expected: Error message displayed"
          value={testCaseDocument}
          onChange={(e) => setTestCaseDocument(e.target.value)}
          className="min-h-[300px] text-base font-mono resize-none"
        />

        <Button
          onClick={analyzeTestValidation}
          disabled={isLoading || !testCaseDocument.trim() || !understandingData}
          className="w-full mt-6 h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Validating Tests...
            </>
          ) : (
            <>
              <TestTube2 className="mr-2 h-5 w-5" />
              Validate Test Coverage
            </>
          )}
        </Button>
      </Card>

      {/* Output Section */}
      {(isLoading || analysis) && (
        <div className="space-y-6">
          {/* Coverage Summary */}
          <Card className="p-6 shadow-lg border-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Test Coverage Summary
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing coverage...</span>
                </div>
              ) : (
                <p className="text-base leading-relaxed whitespace-pre-wrap">{analysis?.coverageSummary}</p>
              )}
            </div>
          </Card>

          {/* Matched Tests */}
          <Card className="p-6 shadow-lg border-2 border-accent/20">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                Matched Tests
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground">Matching tests...</span>
                </div>
              ) : analysis?.matchedTests && analysis.matchedTests.length > 0 ? (
                <div className="space-y-4">
                  {analysis.matchedTests.map((match, index) => (
                    <div key={index} className="bg-background rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold">{match.ac}</p>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">{match.testCase}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No matched tests yet</p>
              )}
            </div>
          </Card>

          {/* Untested AC */}
          <Card className="p-6 shadow-lg border-2 border-destructive/20">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                Untested Acceptance Criteria
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                  <span className="text-sm text-muted-foreground">Identifying gaps...</span>
                </div>
              ) : analysis?.untestedAC && analysis.untestedAC.length > 0 ? (
                <div className="space-y-3">
                  {analysis.untestedAC.map((ac, index) => (
                    <div key={index} className="flex items-start gap-3 bg-destructive/5 rounded-lg p-3">
                      <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{ac}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">All AC covered by tests</p>
              )}
            </div>
          </Card>

          {/* Suggested Tests */}
          <Card className="p-6 shadow-lg border-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <TestTube2 className="w-6 h-6 text-primary" />
                Suggested Test Cases
              </h2>
            </div>
            <div className="bg-muted rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Generating suggestions...</span>
                </div>
              ) : analysis?.suggestedTests && analysis.suggestedTests.length > 0 ? (
                <div className="space-y-4">
                  {analysis.suggestedTests.map((test, index) => (
                    <div key={index} className="bg-background rounded-lg p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{test}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No additional tests suggested</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TestValidationStep;
