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
  X
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
        title: "Empty Content",
        description: "Please paste text or upload a document to translate.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await translateLegalJargon({ documentContent: content })
      setAnalysis(result)
      toast({
        title: "Success",
        description: "Document translated to plain English.",
      })
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate the document. Please try again.",
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
          title: "File Uploaded",
          description: `Uploaded ${file.name}. (Note: For this demo, please paste text for full results if not a .txt file.)`,
        })
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Translated text copied to clipboard.",
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold font-headline">Legal Jargon Translator</h1>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)]">
            {/* Input Section */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <Tabs defaultValue="paste" className="w-full flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                
                <TabsContent value="paste" className="flex-1 flex flex-col mt-0">
                  <Card className="flex-1 shadow-none border bg-card/50 overflow-hidden flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <BookText className="h-4 w-4 text-primary" /> Original Legal Text
                        </CardTitle>
                        <span className="text-[10px] text-muted-foreground uppercase">{content.length} chars</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 border-t flex-1">
                      <Textarea
                        placeholder="Enter legal clauses, contracts, or terms of service..."
                        className="h-full min-h-[300px] w-full rounded-none border-0 focus-visible:ring-0 p-6 resize-none font-body text-sm leading-relaxed"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="upload" className="flex-1 flex flex-col mt-0">
                  <Card 
                    className="flex-1 shadow-none border border-dashed bg-muted/20 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-muted/30 transition-colors" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg mb-2">Upload Legal Document</CardTitle>
                    <CardDescription className="max-w-xs">
                      PDF, DOCX, or TXT contracts
                    </CardDescription>
                    {fileName && (
                      <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium truncate max-w-[150px]">{fileName}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setFileName(null); }}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={handleTranslate} 
                disabled={isLoading} 
                className="w-full h-12 text-lg font-semibold shadow-lg bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-5 w-5" />
                    Translate to Plain English
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
              <Card className="flex-1 shadow-none border bg-white overflow-hidden flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent" /> Translation Results
                      </CardTitle>
                      <CardDescription>AI-powered simplification of your legal text</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0 bg-slate-50/30">
                  {!analysis && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4 py-32">
                      <Languages className="h-20 w-20 opacity-20" />
                      <p className="font-medium text-lg">Input text to see translation</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="p-8 space-y-6">
                      <div className="h-20 w-full bg-muted animate-pulse rounded-xl" />
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-32 w-full bg-muted/50 animate-pulse rounded-xl" />
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis && (
                    <div className="p-6 space-y-8">
                      {/* Summary Box */}
                      <Card className="bg-primary/5 border-primary/20 shadow-none">
                        <CardContent className="pt-6">
                          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Main Purpose</p>
                          <p className="text-sm leading-relaxed text-slate-700">{analysis.summary}</p>
                        </CardContent>
                      </Card>

                      <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Clause Breakdown</h3>
                        {analysis.clauses.map((clause, idx) => (
                          <div key={idx} className="border rounded-xl shadow-sm bg-white overflow-hidden transition-all hover:shadow-md">
                            <div className="p-5 space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Clause {idx + 1}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(clause.plainLanguage)}>
                                  <Copy className="h-4 w-4 opacity-40 hover:opacity-100" />
                                </Button>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Original Text</p>
                                  <div className="text-xs italic bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-500 leading-relaxed">
                                    "{clause.originalText}"
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold uppercase text-primary">Plain Language Translation</p>
                                  <div className="text-sm font-medium leading-relaxed text-slate-800">
                                    {clause.plainLanguage}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
