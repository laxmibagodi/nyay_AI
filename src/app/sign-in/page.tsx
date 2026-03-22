
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, setupRecaptcha, initiatePhoneSignIn } from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Mail, Phone, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const auth = useAuth();
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
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl accent-gradient flex items-center justify-center text-white mx-auto shadow-xl">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tighter">Nyaya AI</h1>
          <p className="text-slate-500 font-bold">Secure Legal Access for Small Business</p>
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
                <Button className="w-full h-14 rounded-2xl font-black text-lg accent-gradient" disabled={isLoading}>
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
              <Button className="w-full h-14 rounded-2xl font-black text-lg accent-gradient" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm font-bold text-slate-500">
          Naye ho? <Link href="/sign-up" className="text-primary underline">Sign Up Karo</Link>
        </p>
      </div>
    </div>
  );
}
