'use server';
/**
 * @fileOverview A Genkit flow to generate standard legal documents like NDAs or vendor agreements.
 *
 * - generateLegalDocument - A function that handles the legal document generation process.
 * - GenerateLegalDocumentInput - The input type for the generateLegalDocument function.
 * - GenerateLegalDocumentOutput - The return type for the generateLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLegalDocumentInputSchema = z.object({
  documentType: z.enum(['NDA', 'Vendor Agreement', 'Simple Contract']).describe('The type of legal document to generate.'),
  clientName: z.string().describe('The name of the client or your company.'),
  otherPartyName: z.string().optional().describe('The name of the other party involved in the document.'),
  purpose: z.string().optional().describe('The purpose or context for the document (e.g., for an NDA).'),
  keyTerms: z.string().optional().describe('Any specific key terms or clauses to include.'),
  additionalInstructions: z.string().optional().describe('Any additional specific instructions or details for the document.'),
});
export type GenerateLegalDocumentInput = z.infer<typeof GenerateLegalDocumentInputSchema>;

const GenerateLegalDocumentOutputSchema = z.object({
  generatedDocument: z.string().describe('The automatically generated legal document.'),
});
export type GenerateLegalDocumentOutput = z.infer<typeof GenerateLegalDocumentOutputSchema>;

export async function generateLegalDocument(input: GenerateLegalDocumentInput): Promise<GenerateLegalDocumentOutput> {
  return generateLegalDocumentFlow(input);
}

const generateLegalDocumentPrompt = ai.definePrompt({
  name: 'generateLegalDocumentPrompt',
  input: {schema: GenerateLegalDocumentInputSchema},
  output: {schema: GenerateLegalDocumentOutputSchema},
  prompt: `You are an AI legal assistant specializing in drafting standard legal documents for small businesses.
Your goal is to generate a complete legal document based on the user's input.

Document Type: {{{documentType}}}

Here are the details provided by the user:
Client/Your Company Name: {{{clientName}}}
{{#if otherPartyName}}Other Party Name: {{{otherPartyName}}}{{/if}}
{{#if purpose}}Purpose/Context: {{{purpose}}}{{/if}}
{{#if keyTerms}}Key Terms to include: {{{keyTerms}}}{{/if}}
{{#if additionalInstructions}}Additional Instructions: {{{additionalInstructions}}}{{/if}}

Please generate a professional, clear, and standard legal document of type "{{{documentType}}}" using the provided information. Ensure it includes all necessary standard clauses for such a document.
The output should be the full text of the document.`,
});

const generateLegalDocumentFlow = ai.defineFlow(
  {
    name: 'generateLegalDocumentFlow',
    inputSchema: GenerateLegalDocumentInputSchema,
    outputSchema: GenerateLegalDocumentOutputSchema,
  },
  async (input) => {
    const {output} = await generateLegalDocumentPrompt(input);
    if (!output) {
      throw new Error('Failed to generate legal document.');
    }
    return output;
  }
);
