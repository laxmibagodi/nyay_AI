
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [popupError, setPopupError] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast({ title: "Required Fields", description: "Please fill in all details.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await initiateEmailSignUp(auth, formData.email, formData.password);
      
      const currentUser = auth.currentUser;
      if (currentUser && db) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          name: formData.name,
          email: formData.email,
          phone: null,
          language: "hi",
          businessType: "",
          plan: "free",
          scansUsed: 0,
          questionsUsed: 0,
          createdAt: serverTimestamp(),
          onboardingComplete: false
        });
      }

      toast({ 
        title: "Account Created", 
        description: "Verification email sent. Redirecting to onboarding...",
      });
      
      router.push('/onboarding');
    } catch (error: any) {
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setPopupError(false);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (db) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || "Nyay User",
            email: user.email,
            phone: user.phoneNumber || null,
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
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      let message = "Could not sign in with Google.";
      
      if (error.code === 'auth/popup-blocked') {
        setPopupError(true);
        message = "Sign-in popup was blocked. Please allow popups for this site.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Google Sign-In is not enabled in your Firebase Console.";
      } else if (error.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized in Firebase Console.";
      }
      
      toast({ 
        title: "Google Sign-In Failed", 
        description: message, 
        variant: "destructive" 
      });
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
          <h1 className="text-4xl font-black text-primary tracking-tighter">Join Nyay AI</h1>
          <p className="text-slate-500 font-bold">Start protecting your business today.</p>
        </div>

        {popupError && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-start animate-in zoom-in-95 duration-300">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs font-bold text-amber-800 leading-relaxed">
              <p className="uppercase tracking-widest text-[10px] mb-1">Action Required</p>
              Your browser blocked the Google window. Please click the icon in your address bar to "Always allow popups" for Nyay AI.
            </div>
          </div>
        )}

        <Card className="border-none shadow-2xl rounded-3xl ring-1 ring-slate-100 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-800">Create Account</CardTitle>
            <CardDescription className="font-medium">Enter your details to register</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  Sign up with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase text-slate-400"><span className="bg-white px-2 tracking-widest">or register with email</span></div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="E.g. Rajesh Kumar" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Business Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="email"
                    placeholder="name@business.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl font-black text-lg accent-gradient shadow-xl shadow-accent/20" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : (
                  <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm font-bold text-slate-500">
          Already have an account? <Link href="/sign-in" className="text-primary underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
