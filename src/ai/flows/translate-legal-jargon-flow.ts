'use server';
/**
 * @fileOverview A Genkit flow for translating complex legal jargon into plain, understandable language.
 *
 * - translateLegalJargon - A function that handles the legal jargon translation process.
 * - TranslateLegalJargonInput - The input type for the translateLegalJargon function.
 * - TranslateLegalJargonOutput - The return type for the translateLegalJargon function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateLegalJargonInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The full content of the legal document to be translated.'),
});
export type TranslateLegalJargonInput = z.infer<
  typeof TranslateLegalJargonInputSchema
>;

const TranslateLegalJargonOutputSchema = z.object({
  plainLanguageTranslation: z
    .string()
    .describe('The translated legal document in plain, understandable language.'),
});
export type TranslateLegalJargonOutput = z.infer<
  typeof TranslateLegalJargonOutputSchema
>;

export async function translateLegalJargon(
  input: TranslateLegalJargonInput
): Promise<TranslateLegalJargonOutput> {
  return translateLegalJargonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateLegalJargonPrompt',
  input: { schema: TranslateLegalJargonInputSchema },
  output: { schema: TranslateLegalJargonOutputSchema },
  prompt: `You are an expert legal assistant specializing in simplifying complex legal documents. Your task is to translate the provided legal document into clear, plain, and understandable language, avoiding jargon wherever possible.

The output should be easy for a non-lawyer to comprehend. Focus on explaining key terms, clauses, and implications in simple terms, without losing the original meaning or intent.

Legal Document:
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
    return output!;
  }
);
