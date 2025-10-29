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
    const { understandingData, testCaseDocument } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!understandingData || !testCaseDocument) {
      return new Response(
        JSON.stringify({ error: 'Understanding data and test case document required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Analyzing test validation');

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
            content: `You are an expert QA engineer specializing in test coverage analysis. Your task is to verify whether code is adequately tested by matching acceptance criteria to existing test cases.

Your analysis must produce outputs in valid JSON format (no markdown, no code blocks):

{
  "coverageSummary": "Summary of overall test coverage quality",
  "matchedTests": [
    {"ac": "Acceptance criterion", "testCase": "Matching test case description"}
  ],
  "untestedAC": ["Untested AC 1", "Untested AC 2"],
  "suggestedTests": [
    "Test Case 1: Title\\nSteps to Test:\\n1. Step\\n2. Step\\nExpected Result: Result"
  ]
}

Tasks:
1. Match each AC from understanding data to existing test cases
2. Identify acceptance criteria NOT covered by any tests
3. Generate new test suggestions for untested AC
4. Provide overall coverage summary

Be thorough in matching and identifying gaps.`
          },
          {
            role: 'user',
            content: `Analyze test coverage:

ACCEPTANCE CRITERIA AND EXPECTED OUTCOMES:
${JSON.stringify(understandingData.expectedOutcomes, null, 2)}

EXISTING TEST CASES:
${testCaseDocument}

Match AC to tests, identify gaps, and suggest new tests.`
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
        coverageSummary: 'Unable to parse analysis',
        matchedTests: [],
        untestedAC: [],
        suggestedTests: []
      };
    }

    const result = {
      coverageSummary: analysisResult.coverageSummary || 'Analysis in progress',
      matchedTests: Array.isArray(analysisResult.matchedTests) ? analysisResult.matchedTests : [],
      untestedAC: Array.isArray(analysisResult.untestedAC) ? analysisResult.untestedAC : [],
      suggestedTests: Array.isArray(analysisResult.suggestedTests) ? analysisResult.suggestedTests : []
    };

    console.log(`Test validation complete`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-test-validation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
