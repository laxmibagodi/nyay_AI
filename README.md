# Nyay AI - Legal Shield for Small Businesses

Nyay AI is a premium, AI-powered legal technology platform designed to empower small business owners with professional-grade legal tools. 

## 🚀 Core Features

- **AI Strategy Room (Legal Assistant):** Context-aware AI chat that can perform deep-dive analysis on documents stored in your vault.
- **Jargon Translator:** Simplifies complex legal documents (PDF, DOCX, TXT) into plain, human-readable English.
- **Risk Identifier:** Automated security audit for contracts that flags unfavorable terms and hidden liabilities with severity ratings.
- **Smart Generator:** High-speed drafting of standard legal agreements like NDAs and Vendor Contracts.
- **Managed Legal Vault:** Persistent, secure storage for all your processed legal documents, powered by Firebase.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & ShadCN UI
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Anonymous Auth
- **AI Engine:** Genkit + Google Gemini 2.5 Flash
- **File Processing:** PDF.js & Mammoth.js

## 🔒 Security & Privacy

Nyay AI uses Firebase's User-Ownership model. All data is siloed within your unique user path (`/users/{userId}`), ensuring that your sensitive legal documents are only accessible to you.

## 🚦 Getting Started

1. **Enable Anonymous Auth:** Ensure Anonymous Authentication is enabled in your Firebase Console.
2. **Setup Firestore:** Ensure Firestore is provisioned in your Firebase project.
3. **Draft or Upload:** Start by drafting a document or uploading an existing one in the Translator or Risk modules.
