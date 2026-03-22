
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, AlertCircle, Lightbulb, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Trap {
  title: string;
  plainText: string;
  whyTrap: string;
  fixSuggestion: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export function TrapCards({ traps }: { traps: Trap[] }) {
  const [current, setCurrent] = useState(0);

  if (!traps || traps.length === 0) return null;

  const trap = traps[current];

  const severityColors = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-blue-500',
  };

  const severityBadges = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    LOW: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-none shadow-2xl bg-white rounded-3xl ring-1 ring-slate-100">
        <div className={`absolute top-0 left-0 w-full h-2 ${severityColors[trap.severity]}`} />
        
        <CardHeader className="pt-8 flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${severityColors[trap.severity]}`}>
              <AlertCircle className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
              🪤 Trap {current + 1} of {traps.length}
            </CardTitle>
          </div>
          <Badge variant="outline" className={`font-black uppercase tracking-tighter text-[10px] px-3 py-1 ${severityBadges[trap.severity]}`}>
            {trap.severity}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-8 px-6 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <Info className="h-3 w-3" /> What it says (Simple)
            </div>
            <p className="text-lg font-bold text-slate-800 leading-tight">
              "{trap.plainText}"
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-red-600 tracking-[0.2em]">
              <AlertCircle className="h-3 w-3" /> Why it's a trap
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {trap.whyTrap}
            </p>
          </div>

          <div className="space-y-3 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">
              <Lightbulb className="h-3 w-3" /> How to fix it
            </div>
            <p className="text-sm font-black text-emerald-800 leading-relaxed">
              {trap.fixSuggestion}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2">
        <Button 
          variant="outline" 
          disabled={current === 0} 
          onClick={() => setCurrent(c => c - 1)}
          className="h-12 w-12 rounded-2xl border-slate-200 shadow-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex gap-1.5">
          {traps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`} />
          ))}
        </div>
        <Button 
          variant="outline" 
          disabled={current === traps.length - 1} 
          onClick={() => setCurrent(c => c + 1)}
          className="h-12 w-12 rounded-2xl border-slate-200 shadow-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
