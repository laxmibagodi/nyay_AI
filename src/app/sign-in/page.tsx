
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { initiateEmailSignIn, setupRecaptcha, initiatePhoneSignIn } from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Mail, Phone, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup, doc, getDoc, setDoc, serverTimestamp } from 'firebase/auth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      router.push('/');
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (db) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            phone: null,
            language: "hi",
            businessType: "",
            plan: "free",
            scansUsed: 0,
            questionsUsed: 0,
            createdAt: serverTimestamp(),
            onboardingComplete: false
          });
          router.push('/onboarding');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const verifier = setupRecaptcha(auth, 'recaptcha-container');
      const result = await initiatePhoneSignIn(auth, phone, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Please check your phone." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp);
      router.push('/');
    } catch (error: any) {
      toast({ title: "Invalid OTP", description: "Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl accent-gradient flex items-center justify-center text-white mx-auto shadow-xl">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tighter">Nyaya AI</h1>
          <p className="text-slate-500 font-bold">Secure Legal Access for Small Business</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            variant="outline" 
            className="w-full h-14 rounded-2xl border-slate-200 bg-white font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase text-slate-400"><span className="bg-slate-50 px-2 tracking-widest">or continue with</span></div>
          </div>

          <Tabs defaultValue="phone" className="w-full bg-white rounded-3xl shadow-2xl p-6 ring-1 ring-slate-100">
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-slate-50 rounded-2xl">
              <TabsTrigger value="phone" className="rounded-xl font-bold">Phone</TabsTrigger>
              <TabsTrigger value="email" className="rounded-xl font-bold">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              {!otpSent ? (
                <form onSubmit={handlePhoneSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Indian Phone Number</p>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="+91 9876543210" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                      />
                    </div>
                  </div>
                  <Button className="w-full h-14 rounded-2xl font-black text-lg accent-gradient shadow-lg shadow-accent/20" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Receive OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">6-Digit Code</p>
                    <Input 
                      placeholder="000000" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-14 text-center text-2xl tracking-[0.5em] rounded-2xl border-slate-100 bg-slate-50 font-black"
                    />
                  </div>
                  <Button className="w-full h-14 rounded-2xl font-black text-lg accent-gradient" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify & Login"}
                  </Button>
                  <Button variant="ghost" className="w-full font-bold text-slate-400" onClick={() => setOtpSent(false)}>Edit Number</Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Business Email</p>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="name@business.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Password</p>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    />
                  </div>
                </div>
                <Button className="w-full h-14 rounded-2xl font-black text-lg accent-gradient shadow-lg shadow-accent/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-sm font-bold text-slate-500">
          Naye ho? <Link href="/sign-up" className="text-primary underline hover:text-accent transition-colors">Sign Up Karo</Link>
        </p>
      </div>
    </div>
  );
}
