'use server';
/**
 * @fileOverview A Genkit flow for translating complex legal jargon into plain language.
 * Now supports dual-language output: Plain English + User's Native Language.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslatedClauseSchema = z.object({
  originalText: z.string().describe('The original legal jargon text.'),
  plainLanguage: z.string().describe('The simplified, plain English translation.'),
  nativeLanguageTranslation: z.string().describe('The translation of the simplification into the user\'s selected native language.'),
});

const TranslateLegalJargonInputSchema = z.object({
  documentContent: z.string().describe('The full content of the legal document to be translated.'),
  targetLanguage: z.string().describe('The user\'s native language for translation (e.g., Hindi, Marathi, Tamil).'),
});
export type TranslateLegalJargonInput = z.infer<typeof TranslateLegalJargonInputSchema>;

const TranslateLegalJargonOutputSchema = z.object({
  summary: z.string().describe('A brief overview of the document translation in the target language.'),
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
  prompt: `You are an expert legal assistant specializing in simplifying complex legal documents for Indian small business owners.
Your task is to translate the provided legal text into clear, plain language.

Target Native Language: {{{targetLanguage}}}

Break the document down into its most important clauses. For each clause:
1. Provide the "originalText".
2. Provide a "plainLanguage" translation in simple English.
3. Provide a "nativeLanguageTranslation" which is the same simplification but in {{{targetLanguage}}}.

Also, provide a high-level "summary" of the document's main purpose in {{{targetLanguage}}}.

Legal Document Content:
{{{documentContent}}}`,
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
