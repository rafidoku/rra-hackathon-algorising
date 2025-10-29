import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, FileText, TestTube, AlertCircle, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">Release Readiness</span>
          </div>
          <Link to="/app">
            <Button variant="default">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6" variant="secondary">
              AI-Powered Pre-Release Validator
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Ship with <span className="text-gradient">Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Validate your releases before they go live. AI-powered analysis of requirements, 
              test coverage, and readiness scoring to catch issues before production.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/app">
                <Button size="lg" className="gap-2">
                  Start Analysis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Issue Detection Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">60%</div>
              <div className="text-sm text-muted-foreground">Time Saved on Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">99.8%</div>
              <div className="text-sm text-muted-foreground">Release Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Three-Layer Validation System</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive analysis from requirements to recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="p-8 gradient-card shadow-elegant hover:shadow-glow transition-smooth border-border/50">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Understanding Layer</h3>
              <p className="text-muted-foreground mb-6">
                AI reviews JIRA tickets, PR descriptions, and commit messages to extract and 
                structure acceptance criteria. Detects missing requirements automatically.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Parse technical notes & AC</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Identify missing elements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Generate feature summary</span>
                </li>
              </ul>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 gradient-card shadow-elegant hover:shadow-glow transition-smooth border-border/50">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <TestTube className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Validation Layer</h3>
              <p className="text-muted-foreground mb-6">
                Verify test coverage by matching acceptance criteria to test cases. 
                Automatically identify gaps and generate test suggestions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Match AC to test cases</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Identify untested scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Auto-generate test templates</span>
                </li>
              </ul>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 gradient-card shadow-elegant hover:shadow-glow transition-smooth border-border/50">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Action Layer</h3>
              <p className="text-muted-foreground mb-6">
                Combine insights into a comprehensive readiness report with actionable 
                recommendations and a release confidence score.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Generate readiness score</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Actionable recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Risk assessment report</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Fast Analysis</h3>
                  <p className="text-muted-foreground">
                    Get comprehensive release analysis in minutes, not hours. AI processes 
                    requirements and test coverage instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Risk Mitigation</h3>
                  <p className="text-muted-foreground">
                    Catch missing requirements, untested scenarios, and documentation gaps 
                    before they reach production.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Data-Driven Decisions</h3>
                  <p className="text-muted-foreground">
                    Make informed go/no-go decisions based on quantifiable readiness scores 
                    and coverage metrics.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-warning" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Early Detection</h3>
                  <p className="text-muted-foreground">
                    Identify issues during development, not after deployment. Save time 
                    and resources with proactive validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 text-center gradient-card shadow-elegant border-border/50">
            <h2 className="text-4xl font-bold mb-4">Ready to Ship with Confidence?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start validating your releases today with AI-powered analysis
            </p>
            <Link to="/app">
              <Button size="lg" className="gap-2">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">Release Readiness Analyzer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Release Readiness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
