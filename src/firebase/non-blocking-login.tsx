
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
  await sendEmailVerification(userCredential.user);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<any> {
  return signInWithEmailAndPassword(authInstance, email, password);
}

/** Phone Auth setup */
export function setupRecaptcha(authInstance: Auth, elementId: string) {
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(authInstance, elementId, {
      'size': 'invisible',
      'callback': () => {}
    });
  }
  return (window as any).recaptchaVerifier;
}

export async function initiatePhoneSignIn(authInstance: Auth, phoneNumber: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(authInstance, phoneNumber, verifier);
}
