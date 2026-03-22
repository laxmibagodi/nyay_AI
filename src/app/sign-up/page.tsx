
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
import { Loader2, ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
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
      // Create Auth Account
      await initiateEmailSignUp(auth, formData.email, formData.password);
      
      const currentUser = auth.currentUser;
      if (currentUser && db) {
        // Create Firestore User Document
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

        <Card className="border-none shadow-2xl rounded-3xl ring-1 ring-slate-100 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-800">Create Account</CardTitle>
            <CardDescription className="font-medium">Enter your details to register</CardDescription>
          </CardHeader>
          <CardContent>
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
