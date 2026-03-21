'use server';
/**
 * @fileOverview A Genkit flow for identifying potential risks and unfavorable terms in legal contracts.
 *
 * - identifyContractRisks - A function that handles the contract risk identification process.
 * - IdentifyContractRisksInput - The input type for the identifyContractRisks function.
 * - IdentifyContractRisksOutput - The return type for the identifyContractRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const IdentifyContractRisksInputSchema = z.object({
  contractContent: z.string().describe('The full text content of the legal contract or agreement.'),
});
export type IdentifyContractRisksInput = z.infer<typeof IdentifyContractRisksInputSchema>;

// Output Schema
const RiskItemSchema = z.object({
  clause: z.string().describe('The verbatim text of the identified risky clause or unfavorable term.'),
  explanation: z.string().describe('A plain language explanation of why this clause is risky, what its implications are, and potential suggestions for mitigation or negotiation.'),
  severity: z.enum(['High', 'Medium', 'Low']).describe('The severity level of the identified risk. "High" for critical issues, "Medium" for significant concerns, "Low" for minor points to consider.'),
});

const IdentifyContractRisksOutputSchema = z.object({
  risks: z.array(RiskItemSchema).describe('A list of identified risky clauses or unfavorable terms in the contract.'),
  summary: z.string().describe('A brief overall summary of the contract risks and key takeaways for the small business owner.'),
});
export type IdentifyContractRisksOutput = z.infer<typeof IdentifyContractRisksOutputSchema>;

// Prompt Definition
const prompt = ai.definePrompt({
  name: 'identifyContractRisksPrompt',
  input: {schema: IdentifyContractRisksInputSchema},
  output: {schema: IdentifyContractRisksOutputSchema},
  prompt: `You are an AI-powered legal expert specializing in small business law, particularly concerning India MSME, GST, and labor laws. Your task is to carefully analyze the provided legal contract or agreement and identify any clauses or terms that could be considered potentially risky, unfavorable, or require careful consideration for a small business owner.\n\nFor each identified risk, provide:\n1. The exact text of the clause.\n2. A clear, plain-language explanation of why it's risky, its potential implications for a small business, and any suggestions for mitigation or negotiation.\n3. A severity level (High, Medium, or Low) to indicate the importance of the risk.\n\nFinally, provide a concise overall summary of the contract risks and key takeaways.\n\nEnsure your output is structured as a JSON object matching the provided schema.\n\nContract Content:\n{{{contractContent}}}`,
});

// Flow Definition
const identifyContractRisksFlow = ai.defineFlow(
  {
    name: 'identifyContractRisksFlow',
    inputSchema: IdentifyContractRisksInputSchema,
    outputSchema: IdentifyContractRisksOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

// Wrapper Function
export async function identifyContractRisks(input: IdentifyContractRisksInput): Promise<IdentifyContractRisksOutput> {
  return identifyContractRisksFlow(input);
}
