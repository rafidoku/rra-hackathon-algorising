import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, TestTube, BarChart3, Plus } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/app" || location.pathname === "/app/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">Release Readiness</span>
            </Link>
            <Button variant="default" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Analysis
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <Link to="/app">
              <Button 
                variant={isRoot ? "default" : "ghost"} 
                className="rounded-b-none"
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/app/understanding">
              <Button 
                variant={location.pathname.includes("/understanding") ? "default" : "ghost"} 
                className="rounded-b-none"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Understanding
              </Button>
            </Link>
            <Link to="/app/validation">
              <Button 
                variant={location.pathname.includes("/validation") ? "default" : "ghost"} 
                className="rounded-b-none"
                size="sm"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Validation
              </Button>
            </Link>
            <Link to="/app/recommendations">
              <Button 
                variant={location.pathname.includes("/recommendations") ? "default" : "ghost"} 
                className="rounded-b-none"
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {isRoot ? (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Start a new release analysis or continue with an existing one
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">12</span>
                </div>
                <h3 className="font-semibold mb-1">Requirements Analyzed</h3>
                <p className="text-sm text-muted-foreground">This month</p>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TestTube className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-2xl font-bold">87%</span>
                </div>
                <h3 className="font-semibold mb-1">Avg. Test Coverage</h3>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-2xl font-bold">94%</span>
                </div>
                <h3 className="font-semibold mb-1">Readiness Score</h3>
                <p className="text-sm text-muted-foreground">Current average</p>
              </Card>
            </div>

            <Card className="p-6 gradient-card shadow-elegant border-border/50">
              <h2 className="text-xl font-bold mb-4">Quick Start</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/app/understanding">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="text-left">
                      <div className="font-semibold mb-1">1. Analyze Requirements</div>
                      <div className="text-xs text-muted-foreground">
                        Parse technical notes and acceptance criteria
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link to="/app/validation">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="text-left">
                      <div className="font-semibold mb-1">2. Validate Tests</div>
                      <div className="text-xs text-muted-foreground">
                        Check test coverage against requirements
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link to="/app/recommendations">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="text-left">
                      <div className="font-semibold mb-1">3. Get Recommendations</div>
                      <div className="text-xs text-muted-foreground">
                        View readiness report and action items
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
