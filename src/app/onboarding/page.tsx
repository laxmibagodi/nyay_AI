
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, ArrowRight, Store, Coffee, Scissors, HardHat, Box, Smartphone, CheckCircle2 } from 'lucide-react';

const languages = [
  { id: 'hi', name: 'हिंदी' },
  { id: 'en', name: 'English' },
  { id: 'kn', name: 'ಕನ್ನಡ' },
  { id: 'ta', name: 'தமிழ்' },
  { id: 'te', name: 'తెలుగు' },
  { id: 'mr', name: 'मराठी' },
];

const businessTypes = [
  { id: 'shop', name: 'Shop', icon: Store },
  { id: 'chai', name: 'Food/Chai', icon: Coffee },
  { id: 'tailor', name: 'Tailor', icon: Scissors },
  { id: 'construction', name: 'Construction', icon: HardHat },
  { id: 'supplier', name: 'Supplier', icon: Box },
  { id: 'other', name: 'Other', icon: Smartphone },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<any>({ language: 'en', businessType: '', primaryWorry: '' });
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const handleComplete = () => {
    if (!user || !db) return;
    const userRef = doc(db, 'users', user.uid);
    updateDocumentNonBlocking(userRef, {
      ...selection,
      onboardingComplete: true
    });
    localStorage.setItem('nyaya_language', selection.language);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {step === 1 && (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-black text-slate-800">Select Language</h1>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang) => (
                <Card 
                  key={lang.id} 
                  onClick={() => { setSelection({...selection, language: lang.id}); setStep(2); }}
                  className={`cursor-pointer transition-all border-2 rounded-2xl h-24 flex items-center justify-center hover:scale-105 ${selection.language === lang.id ? 'border-primary bg-primary/5' : 'border-slate-100'}`}
                >
                  <CardContent className="p-0 text-xl font-black">{lang.name}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-black text-slate-800">Your Business?</h1>
            <div className="grid grid-cols-2 gap-4">
              {businessTypes.map((type) => (
                <Card 
                  key={type.id} 
                  onClick={() => { setSelection({...selection, businessType: type.id}); setStep(3); }}
                  className={`cursor-pointer transition-all border-2 rounded-2xl h-32 flex flex-col items-center justify-center gap-3 hover:scale-105 ${selection.businessType === type.id ? 'border-primary bg-primary/5' : 'border-slate-100'}`}
                >
                  <type.icon className="h-8 w-8 text-slate-400" />
                  <CardContent className="p-0 text-sm font-bold">{type.name}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
              <ShieldCheck className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-800">Nyaya AI is Ready!</h1>
              <p className="text-slate-500 font-medium">Ab aapke saath hai 24/7.</p>
            </div>
            <Button onClick={handleComplete} size="lg" className="w-full h-14 text-lg font-bold rounded-2xl accent-gradient">
              Shuru Karo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
