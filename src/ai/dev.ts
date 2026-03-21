import { config } from 'dotenv';
config();

import '@/ai/flows/get-legal-guidance-flow.ts';
import '@/ai/flows/translate-legal-jargon-flow.ts';
import '@/ai/flows/generate-legal-document-flow.ts';
import '@/ai/flows/identify-contract-risks-flow.ts';