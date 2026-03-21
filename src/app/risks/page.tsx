
"use client"

import { useState, useRef } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AlertCircle, 
  FileSearch, 
  Loader2, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion, 
  Upload, 
  FileText, 
  X,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { identifyContractRisks, IdentifyContractRisksOutput } from "@/ai/flows/identify-contract-risks-flow"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser, useFirestore } from "@/firebase"
import { collection } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { extractTextFromFile } from "@/lib/file-extractor"

export default function RisksPage() {
  const [content, setContent] = useState("")
  const [analysis, setAnalysis] = useState<IdentifyContractRisksOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste text or upload a contract for analysis.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await identifyContractRisks({ contractContent: content })
      setAnalysis(result)

      // Save metadata to Firestore Legal Vault
      if (user && db) {
        const docRef = collection(db, "users", user.uid, "documents")
        addDocumentNonBlocking(docRef, {
          userId: user.uid,
          filename: fileName || `RiskScan-${new Date().getTime().toString().slice(-6)}.txt`,
          storagePath: "vault-storage",
          mimeType: "text/plain",
          uploadDate: new Date().toISOString(),
          status: "processed",
          description: result.summary,
          content: content
        })
        
        toast({
          title: "Scan Complete",
          description: "Vulnerabilities have been identified and saved to your vault.",
        })
      } else {
        toast({
          title: "Identity Pending",
          description: "Securing your vault connection. Please try again in 2 seconds.",
          variant: "destructive"
        })
      }

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error processing the document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsExtracting(true)
      setFileName(file.name)
      try {
        const text = await extractTextFromFile(file)
        setContent(text)
        toast({ title: "File Loaded", description: `Successfully extracted text from ${file.name}` })
      } catch (error: any) {
        setFileName(null)
        toast({ title: "Extraction Failed", description: error.message || "Could not read file.", variant: "destructive" })
      } finally {
        setIsExtracting(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-2">
            <h1 className="text-xl font-bold font-headline text-primary">Risk Identifier</h1>
          </div>
        </header>
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Input */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-800">Security Audit</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Detect hidden liabilities, unfavorable terms, and missing clauses. Supports PDF, DOCX, and TXT files.
                </p>
              </div>

              <Card className="shadow-2xl border-none ring-1 ring-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-accent" /> Audit Source
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 border-b rounded-none">
                      <TabsTrigger value="upload" className="font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Upload File</TabsTrigger>
                      <TabsTrigger value="paste" className="font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Paste Text</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="p-6 m-0">
                      <div 
                        className="h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-all group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".pdf,.docx,.txt" 
                          onChange={handleFileUpload} 
                        />
                        <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          {isExtracting ? <Loader2 className="h-8 w-8 text-accent animate-spin" /> : <Upload className="h-8 w-8 text-accent" />}
                        </div>
                        <h4 className="font-bold text-slate-800">{isExtracting ? "Extracting..." : "Drop legal file here"}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, and TXT</p>
                        
                        {fileName && (
                          <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                            <FileText className="h-3.5 w-3.5 text-accent" />
                            <span className="text-[10px] font-bold text-accent truncate max-w-[120px]">{fileName}</span>
                            <X className="h-3 w-3 text-accent cursor-pointer" onClick={(e) => { e.stopPropagation(); setFileName(null); setContent(""); }} />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="paste" className="p-0 m-0">
                      <Textarea
                        placeholder="Paste your contract clauses here for immediate analysis..."
                        className="min-h-[300px] border-0 focus-visible:ring-0 p-6 text-sm leading-relaxed bg-white rounded-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading || isExtracting} 
                className="w-full h-14 text-lg font-bold shadow-2xl accent-gradient hover:opacity-90 rounded-2xl transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Scanning Infrastructure...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="mr-3 h-5 w-5" />
                    Initiate Risk Audit
                  </>
                )}
              </Button>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7">
              {!analysis && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-300">
                  <ShieldQuestion className="h-24 w-24 mb-6 opacity-10" />
                  <p className="text-xl font-bold">Audit Report Pending</p>
                  <p className="text-sm">Complete the source check to generate analysis</p>
                </div>
              )}

              {isLoading && (
                <div className="space-y-6">
                  <Card className="border-none shadow-sm animate-pulse">
                    <CardHeader className="h-24 bg-slate-100" />
                  </Card>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-40 w-full bg-white animate-pulse rounded-2xl border border-slate-100" />
                    ))}
                  </div>
                </div>
              )}

              {analysis && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <Card className="premium-gradient text-white border-none shadow-2xl overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                      <ShieldCheck className="h-32 w-32" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> AI Threat Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-medium leading-relaxed">{analysis.summary}</p>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Identified Vulnerabilities</h3>
                      <Badge variant="outline" className="font-bold px-3 py-1 rounded-full bg-slate-100 border-slate-200">
                        {analysis.risks.length} Issues Found
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {analysis.risks.map((risk, idx) => (
                        <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all ring-1 ring-slate-100 bg-white overflow-hidden">
                          <div className={`h-1 w-full ${
                            risk.severity === 'High' ? 'bg-red-500' : 
                            risk.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <Badge className={`font-black uppercase tracking-widest text-[10px] ${
                              risk.severity === 'High' ? 'bg-red-100 text-red-700' : 
                              risk.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {risk.severity} Severity
                            </Badge>
                            <AlertCircle className={`h-4 w-4 ${
                              risk.severity === 'High' ? 'text-red-500' : 
                              risk.severity === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                            }`} />
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-[11px] font-mono italic text-slate-500">
                              "{risk.clause}"
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-sm text-primary flex items-center gap-2">
                                <ChevronRight className="h-3 w-3" /> Implication & Mitigation
                              </p>
                              <p className="text-sm text-slate-600 leading-relaxed">{risk.explanation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {analysis.risks.length === 0 && (
                      <Card className="border-emerald-100 bg-emerald-50/50 shadow-none">
                        <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                            <ShieldCheck className="h-8 w-8 text-emerald-600" />
                          </div>
                          <p className="text-xl font-black text-emerald-800">Absolute Integrity</p>
                          <p className="text-sm text-emerald-600 max-w-xs mt-2">No critical risks or unfavorable terms were detected in this analysis.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
