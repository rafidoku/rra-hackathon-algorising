import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Understanding = () => {
  const [technicalNotes, setTechnicalNotes] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!technicalNotes.trim() || !acceptanceCriteria.trim()) {
      toast.error("Please provide both technical notes and acceptance criteria");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        summary: "This feature implements a payment processing system that handles credit card transactions through a third-party gateway. Users can initiate payments from the checkout page, which validates card details and processes the transaction securely.",
        extractedCriteria: [
          { text: "User clicks pay button → Success page appears", covered: true },
          { text: "Invalid card details → Error message displayed", covered: true },
          { text: "Transaction timeout → Retry mechanism triggered", covered: false },
          { text: "Receipt email sent after successful payment", covered: false }
        ],
        missingElements: [
          "Error handling for network failures",
          "Loading state during transaction processing",
          "Transaction confirmation UI flow"
        ],
        riskLevel: "medium"
      });
      setIsAnalyzing(false);
      toast.success("Analysis complete");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Understanding Layer</h1>
        <p className="text-muted-foreground">
          AI analyzes your release documentation to extract and structure requirements
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="p-6 gradient-card shadow-elegant border-border/50">
            <h2 className="text-xl font-semibold mb-4">Technical Notes from TL</h2>
            <Textarea
              placeholder="Paste technical notes, JIRA tickets, or PR descriptions here..."
              className="min-h-[200px] mb-4"
              value={technicalNotes}
              onChange={(e) => setTechnicalNotes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Include context about the feature, technical implementation details, and any relevant documentation
            </p>
          </Card>

          <Card className="p-6 gradient-card shadow-elegant border-border/50">
            <h2 className="text-xl font-semibold mb-4">Acceptance Criteria from PM</h2>
            <Textarea
              placeholder="Paste acceptance criteria here..."
              className="min-h-[200px] mb-4"
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Provide the expected behavior and success conditions for this release
            </p>
          </Card>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full gap-2"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze with AI
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results ? (
            <>
              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">AI Summary</h2>
                  <Badge variant={results.riskLevel === "high" ? "destructive" : results.riskLevel === "medium" ? "default" : "secondary"}>
                    {results.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {results.summary}
                </p>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <h2 className="text-xl font-semibold mb-4">Extracted Acceptance Criteria</h2>
                <div className="space-y-3">
                  {results.extractedCriteria.map((criteria: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      {criteria.covered ? (
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{criteria.text}</p>
                        {!criteria.covered && (
                          <p className="text-xs text-warning mt-1">Needs attention</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50 border-warning/50">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <h2 className="text-xl font-semibold">Missing Elements Detected</h2>
                </div>
                <ul className="space-y-2">
                  {results.missingElements.map((element: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-warning/50 py-1">
                      {element}
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center gradient-card shadow-elegant border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-sm text-muted-foreground">
                Provide your technical notes and acceptance criteria to get started
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Understanding;
