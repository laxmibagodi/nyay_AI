'use server';
/**
 * @fileOverview A Genkit flow that provides step-by-step legal guidance for small business owners based on a 'what-if' scenario.
 *
 * - getLegalScenarioGuidance - A function that handles the legal scenario guidance process.
 * - GetLegalScenarioGuidanceInput - The input type for the getLegalScenarioGuidance function.
 * - GetLegalScenarioGuidanceOutput - The return type for the getLegalScenarioGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLegalScenarioGuidanceInputSchema = z.object({
  scenarioQuestion: z
    .string()
    .describe(
      "The user's 'what-if' legal question or scenario for a small business."
    ),
  businessContext: z
    .string()
    .optional()
    .describe(
      'Optional: Additional context about the small business, such as industry, location, or specific circumstances.'
    ),
});
export type GetLegalScenarioGuidanceInput = z.infer<
  typeof GetLegalScenarioGuidanceInputSchema
>;

const GetLegalScenarioGuidanceOutputSchema = z.object({
  guidance: z
    .string()
    .describe(
      'Clear, step-by-step guidance or explanations related to the legal scenario.'
    ),
  summary: z
    .string()
    .optional()
    .describe('A brief summary of the provided guidance.'),
  disclaimer: z
    .string()
    .describe(
      'A mandatory disclaimer stating that this is AI-generated guidance and not a substitute for professional legal advice.'
    ),
});
export type GetLegalScenarioGuidanceOutput = z.infer<
  typeof GetLegalScenarioGuidanceOutputSchema
>;

export async function getLegalScenarioGuidance(
  input: GetLegalScenarioGuidanceInput
): Promise<GetLegalScenarioGuidanceOutput> {
  return getLegalScenarioGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLegalScenarioGuidancePrompt',
  input: {schema: GetLegalScenarioGuidanceInputSchema},
  output: {schema: GetLegalScenarioGuidanceOutputSchema},
  prompt: `You are an AI-powered legal assistant designed to help small business owners understand complex legal 'what-if' scenarios. Your goal is to provide clear, step-by-step guidance and explanations in plain language, helping them understand their options and potential next steps.

Always include a prominent disclaimer that your guidance is AI-generated and not a substitute for professional legal advice.

User's 'what-if' legal scenario: {{{scenarioQuestion}}}

{{#if businessContext}}
Additional business context: {{{businessContext}}}
{{/if}}

Please provide:
1. A step-by-step guidance on how to approach this scenario.
2. A brief summary of the guidance.
3. A clear disclaimer.`,
});

const getLegalScenarioGuidanceFlow = ai.defineFlow(
  {
    name: 'getLegalScenarioGuidanceFlow',
    inputSchema: GetLegalScenarioGuidanceInputSchema,
    outputSchema: GetLegalScenarioGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
