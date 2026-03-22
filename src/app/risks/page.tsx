
'use client';

import { useState, useRef, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileSearch, 
  Loader2, 
  ShieldAlert, 
  Upload, 
  Camera,
  X,
  Sparkles,
  Zap
} from "lucide-react"
import { identifyContractRisks, IdentifyContractRisksOutput } from "@/ai/flows/identify-contract-risks-flow"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { extractTextFromFile } from "@/lib/file-extractor"
import { TrapCards } from "@/components/trap-card"
import Tesseract from 'tesseract.js';

export default function RisksPage() {
  const [content, setContent] = useState("")
  const [analysis, setAnalysis] = useState<IdentifyContractRisksOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocQuery);

  const startCamera = async () => {
    setIsCameraActive(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      toast({ title: "Camera Error", description: "Could not access camera.", variant: "destructive" })
      setIsCameraActive(false)
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context?.drawImage(videoRef.current, 0, 0)
      
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setIsCameraActive(false)

      setIsExtracting(true)
      const dataUrl = canvasRef.current.toDataURL('image/png')
      try {
        const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng+hin')
        setContent(text)
        toast({ title: "Scan Complete", description: "Text extracted from paper." })
      } catch (err) {
        toast({ title: "OCR Error", description: "Could not read text.", variant: "destructive" })
      } finally {
        setIsExtracting(false)
      }
    }
  }

  const handleAnalyze = async () => {
    if (!user || !userData) return;
    
    if (userData.plan === 'free' && (userData.scansUsed || 0) >= 3) {
      toast({ title: "Limit Reached", description: "Aapke 3 free scans khatam ho gaye. Upgrade to PRO!" });
      return;
    }

    if (!content.trim()) {
      toast({ title: "Input Required", description: "Please provide content to scan.", variant: "destructive" });
      return;
    }

    setIsLoading(true)
    try {
      const result = await identifyContractRisks({ 
        contractContent: content,
        language: userData?.language || 'English'
      })
      setAnalysis(result)

      if (user && db) {
        const colRef = collection(db, "users", user.uid, "documents")
        addDocumentNonBlocking(colRef, {
          userId: user.uid,
          filename: fileName || `Scan-${new Date().getTime().toString().slice(-6)}.txt`,
          uploadDate: new Date().toISOString(),
          status: "processed",
          description: result.verdict,
          content: content
        })
        
        const userRef = doc(db, 'users', user.uid);
        updateDocumentNonBlocking(userRef, {
          scansUsed: (userData.scansUsed || 0) + 1
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Analysis failed.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-black text-primary">Risk Identifier</h1>
        </header>
        
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Security Audit</h2>
            <p className="text-sm text-slate-500 font-medium">Detect hidden 'traps' in digital or paper contracts.</p>
          </div>

          <Card className="shadow-xl border-none ring-1 ring-slate-100 overflow-hidden rounded-3xl">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-100 border-b rounded-none">
                <TabsTrigger value="upload" className="font-black text-[10px] uppercase tracking-widest py-3">File</TabsTrigger>
                <TabsTrigger value="paste" className="font-black text-[10px] uppercase tracking-widest py-3">Paste</TabsTrigger>
                <TabsTrigger value="camera" className="font-black text-[10px] uppercase tracking-widest py-3" onClick={startCamera}>📸 Scan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="p-8 m-0 min-h-[300px] flex items-center justify-center">
                <div 
                  className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-slate-50 group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.txt" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setIsExtracting(true); setFileName(file.name);
                      try { setContent(await extractTextFromFile(file)); } catch (err) { setFileName(null); } finally { setIsExtracting(false); }
                    }
                  }} />
                  <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {isExtracting ? <Loader2 className="h-8 w-8 text-accent animate-spin" /> : <Upload className="h-8 w-8 text-accent" />}
                  </div>
                  <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">{isExtracting ? "Extracting..." : "Upload Legal File"}</h4>
                  {fileName && <p className="mt-4 text-xs font-bold text-accent px-3 py-1 bg-accent/5 rounded-full">{fileName}</p>}
                </div>
              </TabsContent>

              <TabsContent value="paste" className="p-0 m-0">
                <Textarea
                  placeholder="Paste contract clauses here..."
                  className="min-h-[300px] border-0 focus-visible:ring-0 p-8 text-base leading-relaxed bg-white rounded-none font-medium"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="camera" className="p-0 m-0 min-h-[300px] relative bg-black flex items-center justify-center overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {isCameraActive && (
                  <Button onClick={capturePhoto} className="absolute bottom-6 h-16 w-16 rounded-full bg-white text-black shadow-2xl active:scale-95">
                    <Camera className="h-8 w-8" />
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setIsCameraActive(false)} className="absolute top-4 right-4 text-white">
                  <X className="h-6 w-6" />
                </Button>
                {isExtracting && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center text-white">
                    <Loader2 className="h-10 w-10 animate-spin mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">Reading Paper...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || isExtracting || !content.trim()} 
            className="w-full h-16 text-lg font-black shadow-2xl accent-gradient rounded-3xl"
          >
            {isLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <Zap className="mr-3 h-6 w-6" />}
            Initiate Risk Audit
          </Button>

          {analysis && (
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
              <Card className={`border-none shadow-xl rounded-3xl p-8 text-white relative overflow-hidden ${
                analysis.riskLevel === 'SAFE' ? 'bg-emerald-600' :
                analysis.riskLevel === 'CAUTION' ? 'bg-amber-500' : 'bg-red-600'
              }`}>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <ShieldAlert className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                    <Sparkles className="h-4 w-4" /> Verdict
                  </div>
                  <h3 className="text-2xl font-black leading-tight">
                    {analysis.riskLevel === 'SAFE' ? '✅ Safe Lagta Hai!' : 
                     analysis.riskLevel === 'CAUTION' ? '⚠️ Pehle Theek Karo' : '🛑 Sign Mat Karo!'}
                  </h3>
                  <p className="text-lg font-medium opacity-90 leading-snug">{analysis.verdict}</p>
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span>Risk Meter</span>
                      <span>{analysis.riskScore}% Risky</span>
                    </div>
                    <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${analysis.riskScore}%` }} />
                    </div>
                  </div>
                </div>
              </Card>

              <TrapCards traps={analysis.traps} />
            </div>
          )}
        </main>
      </SidebarInset>
    </div>
  )
}
