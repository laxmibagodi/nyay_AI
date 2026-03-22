
'use client';

import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Gavel, Scale, FileText, Bot, Zap, Landmark, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-body selection:bg-accent/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl accent-gradient flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-primary">Nyay AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Sign In</Link>
            <Link href="/sign-up">
              <Button size="sm" className="rounded-xl font-bold bg-primary text-white">Join Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 animate-in fade-in slide-in-from-top-4 duration-500">
            <Zap className="h-3 w-3 text-yellow-500 fill-current" /> India's First Legal Shield for Small Business
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-primary leading-[1.1] max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            Don't Sign Anything <br />
            <span className="text-accent italic">Without Nyay AI</span>
          </h1>
          
          <p className="text-lg md:text-xl font-medium text-slate-500 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Professional legal assistance at your fingertips. Translate jargon, identify traps, and protect your business in your native language.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-16 px-10 rounded-2xl accent-gradient text-xl font-black shadow-2xl shadow-accent/20">
                Start Protecting Free <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/assistant" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-16 px-10 rounded-2xl border-slate-200 text-lg font-black hover:bg-slate-50">
                Explore Features
              </Button>
            </Link>
          </div>
          
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 max-w-3xl mx-auto grayscale group hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-2">
              <Landmark className="h-10 w-10" />
              <span className="text-[10px] font-black uppercase tracking-widest">Indian Law Context</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Scale className="h-10 w-10" />
              <span className="text-[10px] font-black uppercase tracking-widest">Risk Auditing</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Gavel className="h-10 w-10" />
              <span className="text-[10px] font-black uppercase tracking-widest">MSME Shield</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Bot className="h-10 w-10" />
              <span className="text-[10px] font-black uppercase tracking-widest">GenAI Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-primary">Powerful Legal Toolbox</h2>
            <p className="text-slate-500 font-medium">Built specifically for the needs of the Indian MSME sector.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Risk Scan",
                desc: "Upload any contract and we'll flag 'traps' like MSME payment violations or unfair notice periods.",
                icon: ShieldAlert,
                color: "bg-red-500"
              },
              {
                title: "Jargon Translator",
                desc: "Translate dense legalese into your mother tongue instantly. No more confusion over complex clauses.",
                icon: FileText,
                color: "bg-blue-500"
              },
              {
                title: "AI Strategy",
                desc: "Consult our 24/7 AI Legal Assistant for any 'what-if' business scenarios or advice.",
                icon: Bot,
                color: "bg-accent"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className={`w-14 h-14 rounded-2xl ${f.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black mb-3">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <span className="text-xl font-black tracking-tighter text-primary">Nyay AI</span>
            </div>
            <p className="text-sm text-slate-400 font-medium max-w-xs">Empowering 63 million Indian MSMEs with world-class AI legal protection.</p>
          </div>
          <div className="flex gap-10 text-sm font-bold text-slate-500">
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
          <div className="text-[10px] font-black uppercase text-slate-300 tracking-widest">
            © 2024 Nyay AI. Made with ❤️ in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
