import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, TestTube, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Validation = () => {
  const [testCases, setTestCases] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleValidate = async () => {
    if (!testCases.trim()) {
      toast.error("Please provide test cases to validate");
      return;
    }

    setIsValidating(true);
    
    // Simulate AI validation
    setTimeout(() => {
      setResults({
        coverageScore: 73,
        matchedCriteria: [
          { 
            ac: "User clicks pay button → Success page appears", 
            testCase: "test_payment_success_flow()", 
            status: "covered",
            confidence: 95
          },
          { 
            ac: "Invalid card details → Error message displayed", 
            testCase: "test_invalid_card_error()", 
            status: "covered",
            confidence: 90
          }
        ],
        untestedCriteria: [
          {
            ac: "Transaction timeout → Retry mechanism triggered",
            suggestion: "Add test_transaction_timeout_retry() to verify retry logic after 30s timeout"
          },
          {
            ac: "Receipt email sent after successful payment",
            suggestion: "Add test_receipt_email_delivery() to verify email sending and content"
          }
        ],
        generatedTests: [
          {
            name: "test_transaction_timeout_retry",
            code: "// Test timeout and retry mechanism\ntest('should retry on timeout', async () => {\n  // Mock timeout scenario\n  // Verify retry attempts\n  // Check max retry limit\n});"
          },
          {
            name: "test_receipt_email_delivery",
            code: "// Test email delivery\ntest('should send receipt email', async () => {\n  // Process payment\n  // Verify email sent\n  // Check email content\n});"
          }
        ]
      });
      setIsValidating(false);
      toast.success("Validation complete");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Validation Layer</h1>
        <p className="text-muted-foreground">
          Verify test coverage and identify gaps in your test suite
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="p-6 gradient-card shadow-elegant border-border/50">
            <h2 className="text-xl font-semibold mb-4">Test Cases Documentation</h2>
            <Textarea
              placeholder="Paste your test cases, test plan, or test documentation here..."
              className="min-h-[400px] mb-4 font-mono text-sm"
              value={testCases}
              onChange={(e) => setTestCases(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Include test case names, descriptions, and any relevant test documentation
            </p>
          </Card>

          <Button 
            onClick={handleValidate} 
            disabled={isValidating}
            className="w-full gap-2"
            size="lg"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating Coverage...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Validate Test Coverage
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results ? (
            <>
              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <h2 className="text-xl font-semibold mb-4">Coverage Summary</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Test Coverage</span>
                      <span className="text-2xl font-bold">{results.coverageScore}%</span>
                    </div>
                    <Progress value={results.coverageScore} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">{results.matchedCriteria.length}</div>
                      <div className="text-xs text-muted-foreground">Covered AC</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">{results.untestedCriteria.length}</div>
                      <div className="text-xs text-muted-foreground">Gaps Found</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <h2 className="text-xl font-semibold mb-4">Matched Test Cases</h2>
                <div className="space-y-3">
                  {results.matchedCriteria.map((match: any, index: number) => (
                    <div key={index} className="p-3 rounded-lg bg-success/10 border border-success/20">
                      <div className="flex items-start gap-3 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{match.ac}</p>
                          <code className="text-xs text-muted-foreground">{match.testCase}</code>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {match.confidence}% confidence
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50 border-warning/50">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                  <h2 className="text-xl font-semibold">Untested Scenarios</h2>
                </div>
                <div className="space-y-4">
                  {results.untestedCriteria.map((gap: any, index: number) => (
                    <div key={index} className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="flex items-start gap-3 mb-2">
                        <XCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">{gap.ac}</p>
                      </div>
                      <p className="text-xs text-muted-foreground pl-8">{gap.suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50 border-accent/50">
                <h2 className="text-xl font-semibold mb-4">Auto-Generated Test Templates</h2>
                <div className="space-y-4">
                  {results.generatedTests.map((test: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-medium">{test.name}</code>
                        <Button variant="outline" size="sm">Copy</Button>
                      </div>
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {test.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center gradient-card shadow-elegant border-border/50">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <TestTube className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Validate</h3>
              <p className="text-sm text-muted-foreground">
                Provide your test cases to check coverage against requirements
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Validation;
