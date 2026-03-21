'use server';
/**
 * @fileOverview A Genkit flow for translating complex legal jargon into plain language.
 * Focuses solely on simplification for better accessibility.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslatedClauseSchema = z.object({
  originalText: z.string().describe('The original legal jargon text.'),
  plainLanguage: z.string().describe('The simplified, plain English translation.'),
});

const TranslateLegalJargonInputSchema = z.object({
  documentContent: z.string().describe('The full content of the legal document to be translated.'),
});
export type TranslateLegalJargonInput = z.infer<typeof TranslateLegalJargonInputSchema>;

const TranslateLegalJargonOutputSchema = z.object({
  summary: z.string().describe('A brief overview of the document translation.'),
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
Your task is to translate the provided legal text into clear, plain language.

Break the document down into its most important clauses. For each clause:
1. Provide the "originalText".
2. Provide a "plainLanguage" translation that a non-lawyer can easily understand.

Also, provide a high-level "summary" of the document's main purpose.

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
    if (!output) throw new Error('Failed to translate document.');
    return output;
  }
);
