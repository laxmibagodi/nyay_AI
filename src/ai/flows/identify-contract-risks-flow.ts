
'use server';
/**
 * @fileOverview A Genkit flow for identifying traps and unfavorable terms in Indian legal contracts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrapSchema = z.object({
  title: z.string().describe('Short title for the trap.'),
  plainText: z.string().describe('What the clause says in very simple, non-legal language.'),
  whyTrap: z.string().describe('Why this is harmful for a small business owner.'),
  fixSuggestion: z.string().describe('Exactly what the user should ask for to fix it.'),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).describe('Risk level.'),
});

const IdentifyContractRisksInputSchema = z.object({
  contractContent: z.string().describe('The full text content of the contract.'),
  language: z.string().default('English').describe('The language to respond in.'),
});
export type IdentifyContractRisksInput = z.infer<typeof IdentifyContractRisksInputSchema>;

const IdentifyContractRisksOutputSchema = z.object({
  riskScore: z.number().describe('A score from 0-100 indicating how risky the contract is.'),
  riskLevel: z.enum(['SAFE', 'CAUTION', 'DANGER', 'CRITICAL']).describe('Overall risk level.'),
  verdict: z.string().describe('A concise verdict in the chosen language (under 80 words).'),
  traps: z.array(TrapSchema).describe('A list of identified traps.'),
});
export type IdentifyContractRisksOutput = z.infer<typeof IdentifyContractRisksOutputSchema>;

const prompt = ai.definePrompt({
  name: 'identifyContractRisksPrompt',
  input: {schema: IdentifyContractRisksInputSchema},
  output: {schema: IdentifyContractRisksOutputSchema},
  prompt: `You are Nyaya AI, a specialized legal assistant for Indian small businesses. 
ALWAYS respond in {{{language}}}.
Never use legal jargon. Speak like a trusted friend.
Call problems 'traps' not 'clauses' or 'issues'.

Reference Indian laws specifically:
- Indian Contract Act, 1872
- MSME Development Act, 2006 (Remember: small businesses MUST be paid within 45 days)
- Transfer of Property Act, 1882 (for rental/lease)
- IT Act, 2000
- Consumer Protection Act, 2019

Specifically look for:
- Notice periods < 30 days
- Payment terms > 45 days (MSME Violation)
- Jurisdiction outside the user's city
- One-sided liability
- Auto-renewals without consent
- Loss of IP rights

The 'verdict' should end with ONE clear action: "Sign" / "Don't Sign" / "Fix These Things First".

Contract Content:
{{{contractContent}}}`,
});

export async function identifyContractRisks(input: IdentifyContractRisksInput): Promise<IdentifyContractRisksOutput> {
  const {output} = await prompt(input);
  return output!;
}
