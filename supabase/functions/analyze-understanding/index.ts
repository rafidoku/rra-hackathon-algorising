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
    const { technicalNotes, acceptanceCriteria } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!technicalNotes && !acceptanceCriteria) {
      return new Response(
        JSON.stringify({ error: 'Technical notes or acceptance criteria required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Analyzing understanding with technical notes and acceptance criteria');

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
            content: `You are an expert technical reviewer and QA analyst. Your task is to analyze technical context and acceptance criteria to understand what a release does and identify gaps.

You will analyze:
1. Technical Notes (from Tech Lead): JIRA tickets, PR descriptions, commit messages
2. Acceptance Criteria (from Product Manager): Expected behaviors and requirements

Your analysis must produce outputs in valid JSON format (no markdown, no code blocks):

{
  "featureSummary": "Clear 2-3 sentence summary of what this release does",
  "missingRequirements": ["Requirement 1", "Requirement 2"],
  "expectedOutcomes": ["Outcome 1", "Outcome 2"]
}

Tasks:
1. Parse and summarize what the feature does
2. Extract and structure acceptance criteria into clear expected outcomes
3. Detect missing, unclear, or incomplete requirements

Be thorough and specific in identifying gaps and risks.`
          },
          {
            role: 'user',
            content: `Review this release:

TECHNICAL NOTES (from Tech Lead):
${technicalNotes || 'Not provided'}

ACCEPTANCE CRITERIA (from Product Manager):
${acceptanceCriteria || 'Not provided'}

Provide comprehensive analysis.`
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
      console.log('Raw content:', aiContent);
      
      analysisResult = {
        featureSummary: aiContent.substring(0, 500),
        missingRequirements: ['Unable to parse detailed analysis'],
        expectedOutcomes: []
      };
    }

    const result = {
      featureSummary: analysisResult.featureSummary || 'Analysis in progress',
      missingRequirements: Array.isArray(analysisResult.missingRequirements) 
        ? analysisResult.missingRequirements 
        : [],
      expectedOutcomes: Array.isArray(analysisResult.expectedOutcomes) 
        ? analysisResult.expectedOutcomes 
        : []
    };

    console.log(`Understanding analysis complete`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-understanding function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
