'use server';
/**
 * @fileOverview A Genkit flow for translating complex legal jargon into plain language
 * and identifying risk levels (Red/Yellow/Green) with explanations and fixes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslatedClauseSchema = z.object({
  originalText: z.string().describe('The original legal jargon text.'),
  plainLanguage: z.string().describe('The simplified, plain English translation.'),
  riskLevel: z.enum(['Red', 'Yellow', 'Green']).describe('Risk level: Red (High), Yellow (Medium), Green (Normal).'),
  reason: z.string().describe('Why this risk level was assigned.'),
  suggestedFix: z.string().describe('A practical suggestion to fix or improve the clause.'),
});

const TranslateLegalJargonInputSchema = z.object({
  documentContent: z.string().describe('The full content of the legal document to be translated.'),
});
export type TranslateLegalJargonInput = z.infer<typeof TranslateLegalJargonInputSchema>;

const TranslateLegalJargonOutputSchema = z.object({
  summary: z.string().describe('A brief overview of the document assessment.'),
  clauses: z.array(TranslatedClauseSchema).describe('A list of analyzed and translated clauses.'),
});
export type TranslateLegalJargonOutput = z.infer<typeof TranslateLegalJargonOutputSchema>;

export async function translateLegalJargon(
  input: TranslateLegalJargonInput
): Promise<TranslateLegalJargonOutput> {
  return translateLegalJargonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateLegalJargonPrompt',
  input: { schema: TranslateLegalJargonInputSchema },
  output: { schema: TranslateLegalJargonOutputSchema },
  prompt: `You are an expert legal assistant specializing in simplifying complex legal documents for small business owners.
Your task is to translate the provided legal text into clear, plain language AND perform a risk assessment.

Break the document down into its most important clauses. For each clause:
1. Provide the "originalText".
2. Provide a "plainLanguage" translation that a non-lawyer can easily understand.
3. Assign a "riskLevel":
   - "Red": If the clause is highly unfavorable, contains hidden liabilities, or significantly limits rights.
   - "Yellow": If the clause is standard but requires caution or negotiation.
   - "Green": If the clause is standard, fair, and safe for a small business.
4. Provide a "reason" for the assigned risk level.
5. Provide a "suggestedFix" to make the clause more favorable or safer.

Also, provide a high-level "summary" of the entire document's risk profile.

Legal Document Content:
{{documentContent}}`,
});

const translateLegalJargonFlow = ai.defineFlow(
  {
    name: 'translateLegalJargonFlow',
    inputSchema: TranslateLegalJargonInputSchema,
    outputSchema: TranslateLegalJargonOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('Failed to analyze document.');
    return output;
  }
);
