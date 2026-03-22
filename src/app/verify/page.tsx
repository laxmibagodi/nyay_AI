
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
  const auth = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkVerification = setInterval(() => {
      auth.currentUser?.reload().then(() => {
        if (auth.currentUser?.emailVerified) {
          setIsVerified(true);
          clearInterval(checkVerification);
          setTimeout(() => router.push('/onboarding'), 2000);
        }
      });
    }, 3000);

    return () => clearInterval(checkVerification);
  }, [auth, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md space-y-8">
        <div className="w-16 h-16 rounded-3xl accent-gradient flex items-center justify-center text-white mx-auto shadow-xl">
          {isVerified ? <CheckCircle2 className="h-10 w-10" /> : <Mail className="h-10 w-10" />}
        </div>

        <Card className="border-none shadow-2xl rounded-3xl ring-1 ring-slate-100 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-slate-800">
              {isVerified ? "Email Verified!" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="font-medium">
              {isVerified 
                ? "Perfect! Redirecting you to set up your business profile..." 
                : `We've sent a verification link to ${auth.currentUser?.email}. Please check your inbox and spam folder.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isVerified && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 font-bold leading-relaxed">
                We are waiting for you to click the link in your email. This page will update automatically once verified.
              </div>
            )}
            
            <Link href="/sign-in">
              <Button variant="ghost" className="w-full font-bold text-slate-400">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
