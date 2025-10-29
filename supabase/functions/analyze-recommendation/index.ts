import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { understandingData, testValidationData, testResults } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!understandingData || !testValidationData || !testResults) {
      return new Response(
        JSON.stringify({ error: 'All previous step data and test results required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating release recommendations');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert release manager and QA lead. Your task is to combine all insights from understanding analysis and test validation with actual QA test results to generate a comprehensive Release Readiness Report.

Your analysis must produce outputs in valid JSON format (no markdown, no code blocks):

{
  "readinessScore": 85,
  "readinessReport": "Comprehensive report summarizing release readiness",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "actionItems": [
    {"priority": "High", "action": "Write missing test for payment flow"},
    {"priority": "Medium", "action": "Update changelog with new features"}
  ]
}

Tasks:
1. Generate a readiness score (0-100) based on:
   - Missing requirements from understanding analysis
   - Test coverage gaps
   - Failed QA tests
   - Overall risk assessment

2. Create comprehensive readiness report covering:
   - Overall assessment
   - Key risks and blockers
   - Test coverage status
   - Quality indicators

3. Provide specific, actionable recommendations:
   - Write missing tests
   - Fix failing tests
   - Update documentation
   - Add changelog entries
   - Address unclear requirements

4. Prioritize action items (High/Medium/Low) based on impact

Be specific and actionable in all recommendations.`
          },
          {
            role: 'user',
            content: `Generate release readiness report:

UNDERSTANDING ANALYSIS:
Feature: ${understandingData.featureSummary}
Missing Requirements: ${JSON.stringify(understandingData.missingRequirements)}
Expected Outcomes: ${JSON.stringify(understandingData.expectedOutcomes)}

TEST VALIDATION:
Coverage Summary: ${testValidationData.coverageSummary}
Untested AC: ${JSON.stringify(testValidationData.untestedAC)}
Test Suggestions: ${testValidationData.suggestedTests.length} suggested

QA TEST RESULTS:
${testResults}

Generate comprehensive readiness assessment with score and actionable recommendations.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service quota exceeded. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const aiContent = data.choices?.[0]?.message?.content;
    if (!aiContent) {
      throw new Error('No content in AI response');
    }

    let analysisResult;
    try {
      const cleanContent = aiContent
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      
      analysisResult = {
        readinessScore: 50,
        readinessReport: 'Unable to parse analysis',
        recommendations: [],
        actionItems: []
      };
    }

    const result = {
      readinessScore: typeof analysisResult.readinessScore === 'number' 
        ? analysisResult.readinessScore 
        : 50,
      readinessReport: analysisResult.readinessReport || 'Analysis in progress',
      recommendations: Array.isArray(analysisResult.recommendations) 
        ? analysisResult.recommendations 
        : [],
      actionItems: Array.isArray(analysisResult.actionItems) 
        ? analysisResult.actionItems 
        : []
    };

    console.log(`Recommendation analysis complete: ${result.readinessScore}% ready`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-recommendation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
