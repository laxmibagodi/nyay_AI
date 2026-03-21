"use client"

import { useState, useRef } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookText, 
  Languages, 
  Loader2, 
  Copy, 
  CheckCircle2, 
  Upload, 
  FileText, 
  X,
  Sparkles,
  Info
} from "lucide-react"
import { translateLegalJargon, TranslateLegalJargonOutput } from "@/ai/flows/translate-legal-jargon-flow"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TranslatorPage() {
  const [content, setContent] = useState("")
  const [analysis, setAnalysis] = useState<TranslateLegalJargonOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please paste text or upload a document to translate.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setAnalysis(null) // Reset results before new call
    
    try {
      const result = await translateLegalJargon({ documentContent: content })
      if (result) {
        setAnalysis(result)
        toast({
          title: "Translation Complete",
          description: "Legal jargon has been simplified.",
        })
      } else {
        throw new Error("Empty result from AI service")
      }
    } catch (error) {
      console.error("Translation Error:", error)
      toast({
        title: "Service Error",
        description: "Failed to connect to the translation engine.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      if (file.type === "text/plain") {
        const reader = new FileReader()
        reader.onload = (e) => setContent(e.target?.result as string)
        reader.readAsText(file)
      } else {
        toast({
          title: "File Registered",
          description: `Uploaded ${file.name}. Please ensure you've pasted the content for analysis in this demo.`,
        })
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text saved to clipboard.",
    })
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-2">
            <h1 className="text-xl font-bold font-headline text-primary">Jargon Translator</h1>
          </div>
        </header>
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Input Section */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-800">Legal Input</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paste complex clauses or entire agreements. Our AI will break them down into human-readable English.
                </p>
              </div>

              <Tabs defaultValue="paste" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-200/50 rounded-xl mb-6">
                  <TabsTrigger value="paste" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Paste Text</TabsTrigger>
                  <TabsTrigger value="upload" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Upload File</TabsTrigger>
                </TabsList>
                
                <TabsContent value="paste" className="mt-0">
                  <Card className="border-none shadow-xl overflow-hidden ring-1 ring-slate-200">
                    <CardHeader className="bg-slate-50/50 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <BookText className="h-3 w-3" /> Input Context
                        </CardTitle>
                        <span className="text-[10px] font-bold text-muted-foreground">{content.length} characters</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Textarea
                        placeholder="Paste your legal document content here..."
                        className="min-h-[400px] w-full border-0 focus-visible:ring-0 p-6 text-sm leading-relaxed bg-white font-body"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="upload" className="mt-0">
                  <div 
                    className="h-[464px] rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center p-10 text-center cursor-pointer group shadow-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                    <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <Upload className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Import Document</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8">
                      We support PDF, DOCX, and TXT files. For optimal results in this version, please paste text.
                    </p>
                    {fileName && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold truncate max-w-[150px]">{fileName}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={(e) => { e.stopPropagation(); setFileName(null); }}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={handleTranslate} 
                disabled={isLoading} 
                className="w-full h-14 text-lg font-bold shadow-2xl accent-gradient hover:opacity-90 rounded-2xl transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Processing Intelligence...
                  </>
                ) : (
                  <>
                    <Languages className="mr-3 h-5 w-5" />
                    Translate to Plain English
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-7">
              <div className="space-y-6 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-800">Simplification Output</h2>
                  {analysis && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 className="h-3 w-3" /> Verified by Nyay AI
                    </div>
                  )}
                </div>

                {!analysis && !isLoading && (
                  <div className="flex-1 flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed text-slate-300">
                    <Sparkles className="h-20 w-20 mb-6 opacity-20" />
                    <p className="text-xl font-bold">Awaiting Input Content</p>
                    <p className="text-sm">Translation results will appear here in real-time</p>
                  </div>
                )}

                {isLoading && (
                  <div className="space-y-6">
                    <Card className="border-none shadow-sm animate-pulse">
                      <CardHeader className="h-24 bg-slate-100" />
                    </Card>
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 w-full bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
                      ))}
                    </div>
                  </div>
                )}

                {analysis && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                    {/* High Level Summary */}
                    <Card className="premium-gradient text-white border-none shadow-2xl overflow-hidden relative">
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Info className="h-32 w-32" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Executive Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium leading-relaxed">{analysis.summary}</p>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Clause-by-Clause Translation</h3>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      
                      {analysis.clauses.map((clause, idx) => (
                        <Card key={idx} className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-all ring-1 ring-slate-100">
                          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            <div className="flex-1 p-6 bg-slate-50/50">
                              <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Original Jargon</p>
                              <div className="text-sm italic text-slate-500 leading-relaxed font-body">
                                "{clause.originalText}"
                              </div>
                            </div>
                            <div className="flex-[1.5] p-6 bg-white relative">
                              <div className="absolute top-4 right-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-accent" onClick={() => copyToClipboard(clause.plainLanguage)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-[10px] font-black uppercase text-accent mb-3 tracking-widest">Plain English</p>
                              <div className="text-base font-semibold text-slate-800 leading-relaxed">
                                {clause.plainLanguage}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
