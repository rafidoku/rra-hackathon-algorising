import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileSearch, TestTube2, CheckCircle2, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileSearch,
      title: "Understanding the Text",
      description: "AI reviews JIRA tickets, PR descriptions, and commit messages to identify risks and missing elements",
      highlights: [
        "Parse and summarize feature functionality",
        "Extract and structure Acceptance Criteria",
        "Detect missing or unclear requirements",
        "Compare PR content vs AC expectations"
      ]
    },
    {
      icon: TestTube2,
      title: "Automation Test Validation",
      description: "Verify test coverage and identify gaps in your testing strategy",
      highlights: [
        "Match AC to existing test cases",
        "Identify untested acceptance criteria",
        "Generate new test suggestions automatically",
        "Flag AC not covered by tests"
      ]
    },
    {
      icon: CheckCircle2,
      title: "Release Recommendations",
      description: "Get actionable insights and readiness scores for your release",
      highlights: [
        "Generate release readiness score",
        "Recommend specific actions",
        "Comprehensive readiness report",
        "Track missing tests and documentation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Pre-Release Validator</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Release Readiness Analyzer
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Validate your releases with AI-powered analysis of technical context, test coverage, and readiness recommendations
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/analyzer")}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
            >
              Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                </div>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Three-step validation process for release confidence</p>
        </div>
        <div className="max-w-4xl mx-auto grid gap-8">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Understanding the Text</h3>
              <p className="text-muted-foreground">
                Input technical notes from your Tech Lead and acceptance criteria from your Product Manager. 
                AI analyzes the content, summarizes the feature, and identifies any missing or unclear requirements.
              </p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Automation Test Validation</h3>
              <p className="text-muted-foreground">
                Upload your test case document. AI matches acceptance criteria to existing tests, identifies gaps, 
                and generates suggestions for missing test coverage.
              </p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-full bg-primary-glow text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Release Recommendations</h3>
              <p className="text-muted-foreground">
                Provide QA test results. AI generates a comprehensive readiness score and actionable recommendations 
                for your release including missing tests, documentation needs, and changelog items.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-2">
          <h2 className="text-3xl font-bold mb-4">Ready to Validate Your Release?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get AI-powered insights and confidence in your release readiness
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/analyzer")}
            className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
          >
            Start Your Analysis <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Landing;
