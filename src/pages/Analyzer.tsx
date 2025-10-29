import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSearch, TestTube2, CheckCircle2 } from "lucide-react";
import UnderstandingStep from "@/components/analyzer/UnderstandingStep";
import TestValidationStep from "@/components/analyzer/TestValidationStep";
import RecommendationStep from "@/components/analyzer/RecommendationStep";

export interface UnderstandingResult {
  featureSummary: string;
  missingRequirements: string[];
  expectedOutcomes: string[];
}

export interface TestValidationResult {
  coverageSummary: string;
  matchedTests: Array<{ ac: string; testCase: string }>;
  untestedAC: string[];
  suggestedTests: string[];
}

export interface RecommendationResult {
  readinessScore: number;
  recommendations: string[];
  readinessReport: string;
  actionItems: Array<{ priority: string; action: string }>;
}

const Analyzer = () => {
  const navigate = useNavigate();
  const [understandingData, setUnderstandingData] = useState<UnderstandingResult | null>(null);
  const [testValidationData, setTestValidationData] = useState<TestValidationResult | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            onClick={() => navigate("/")}
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
          >
            Release Readiness Analyzer
          </h1>
          <p className="text-lg text-muted-foreground">
            Three-step validation process for release confidence
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="understanding" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="understanding" className="flex items-center gap-2">
              <FileSearch className="w-4 h-4" />
              <span className="hidden sm:inline">Understanding</span>
            </TabsTrigger>
            <TabsTrigger value="test-validation" className="flex items-center gap-2">
              <TestTube2 className="w-4 h-4" />
              <span className="hidden sm:inline">Test Validation</span>
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Recommendation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="understanding">
            <UnderstandingStep onComplete={setUnderstandingData} />
          </TabsContent>

          <TabsContent value="test-validation">
            <TestValidationStep 
              understandingData={understandingData}
              onComplete={setTestValidationData}
            />
          </TabsContent>

          <TabsContent value="recommendation">
            <RecommendationStep 
              understandingData={understandingData}
              testValidationData={testValidationData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analyzer;
