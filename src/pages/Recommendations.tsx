import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText, CheckCircle2, AlertCircle, TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";

const Recommendations = () => {
  const [testResults, setTestResults] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerate = async () => {
    if (!testResults.trim()) {
      toast.error("Please provide test results to generate recommendations");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI report generation
    setTimeout(() => {
      setReport({
        readinessScore: 78,
        riskLevel: "medium",
        recommendation: "CONDITIONAL GO",
        categories: {
          requirements: { score: 85, status: "good" },
          testing: { score: 73, status: "warning" },
          documentation: { score: 65, status: "warning" },
          riskMitigation: { score: 82, status: "good" }
        },
        criticalIssues: [
          "2 acceptance criteria not covered by tests",
          "Missing error handling for network failures"
        ],
        actionItems: [
          {
            priority: "high",
            category: "Testing",
            action: "Add test cases for timeout and retry scenarios",
            impact: "Reduces risk of production timeouts going undetected"
          },
          {
            priority: "high",
            category: "Testing",
            action: "Implement test for email receipt delivery",
            impact: "Ensures critical post-payment flow is validated"
          },
          {
            priority: "medium",
            category: "Documentation",
            action: "Document error handling flows in technical spec",
            impact: "Improves maintainability and onboarding"
          },
          {
            priority: "medium",
            category: "Code Review",
            action: "Add loading state UI during transaction processing",
            impact: "Enhances user experience during payment flow"
          },
          {
            priority: "low",
            category: "Documentation",
            action: "Update changelog with feature details",
            impact: "Keeps stakeholders informed"
          }
        ],
        metrics: {
          totalAC: 4,
          coveredAC: 2,
          testCases: 8,
          passingTests: 7,
          estimatedRisk: "Medium - Core functionality tested but edge cases need coverage"
        }
      });
      setIsGenerating(false);
      toast.success("Readiness report generated");
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-success";
      case "warning": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Action Layer</h1>
        <p className="text-muted-foreground">
          Get a comprehensive readiness report with actionable recommendations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="p-6 gradient-card shadow-elegant border-border/50">
            <h2 className="text-xl font-semibold mb-4">Test Results from QA</h2>
            <Textarea
              placeholder="Paste test execution results, QA reports, or test summaries here..."
              className="min-h-[300px] mb-4"
              value={testResults}
              onChange={(e) => setTestResults(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Include test pass/fail status, coverage metrics, and any QA observations
            </p>
          </Card>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Readiness Report
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {report ? (
            <>
              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Release Readiness Score</h2>
                  <Badge variant={report.readinessScore >= 85 ? "default" : report.readinessScore >= 70 ? "secondary" : "destructive"} className="text-sm">
                    {report.recommendation}
                  </Badge>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold mb-2">{report.readinessScore}%</div>
                  <p className="text-sm text-muted-foreground">Overall Readiness</p>
                </div>
                <Progress value={report.readinessScore} className="h-3 mb-6" />
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(report.categories).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-3 rounded-lg bg-muted/50">
                      <div className={`text-2xl font-bold ${getStatusColor(value.status)}`}>
                        {value.score}%
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {report.criticalIssues.length > 0 && (
                <Card className="p-6 gradient-card shadow-elegant border-border/50 border-destructive/50">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <h2 className="text-xl font-semibold">Critical Issues</h2>
                  </div>
                  <ul className="space-y-2">
                    {report.criticalIssues.map((issue: string, index: number) => (
                      <li key={index} className="text-sm pl-4 border-l-2 border-destructive/50 py-1">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Action Items</h2>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
                <div className="space-y-3">
                  {report.actionItems.map((item: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getPriorityColor(item.priority) as any} className="text-xs">
                              {item.priority.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.category}</span>
                          </div>
                          <p className="text-sm font-medium mb-2">{item.action}</p>
                          <p className="text-xs text-muted-foreground">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            {item.impact}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Acceptance Criteria</span>
                    <span className="font-semibold">{report.metrics.coveredAC}/{report.metrics.totalAC} covered</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Test Cases</span>
                    <span className="font-semibold">{report.metrics.testCases} total</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Passing Tests</span>
                    <span className="font-semibold">{report.metrics.passingTests}/{report.metrics.testCases}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-1">Risk Assessment:</p>
                    <p className="text-sm">{report.metrics.estimatedRisk}</p>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center gradient-card shadow-elegant border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Generate Report</h3>
              <p className="text-sm text-muted-foreground">
                Provide test results to generate a comprehensive readiness report
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
