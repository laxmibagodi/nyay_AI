"use client"

import { useState, useRef } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, FileSearch, Loader2, ShieldAlert, ShieldCheck, ShieldQuestion, Upload, FileText, X } from "lucide-react"
import { identifyContractRisks, IdentifyContractRisksOutput } from "@/ai/flows/identify-contract-risks-flow"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser, useFirestore } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function RisksPage() {
  const [content, setContent] = useState("")
  const [analysis, setAnalysis] = useState<IdentifyContractRisksOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Document",
        description: "Please paste text or upload a contract for analysis.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await identifyContractRisks({ contractContent: content })
      setAnalysis(result)

      // Save metadata to Firestore
      if (user && db) {
        const docRef = collection(db, "users", user.uid, "documents")
        addDocumentNonBlocking(docRef, {
          userId: user.uid,
          filename: fileName || `RiskScan-${new Date().getTime()}.txt`,
          storagePath: "in-memory",
          mimeType: "text/plain",
          uploadDate: new Date().toISOString(),
          status: "processed",
          description: result.summary,
          content: content
        })
      }

    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze the contract. Please try again.",
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
      const reader = new FileReader()
      reader.onload = (e) => setContent(e.target?.result as string)
      reader.readAsText(file)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold font-headline">Risk Identifier</h1>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card className="shadow-none border h-fit sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileSearch className="h-4 w-4" /> Contract Content
                  </CardTitle>
                  <CardDescription>Upload or paste your agreement for a deep scan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="paste" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="paste">Paste</TabsTrigger>
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="paste" className="mt-4">
                      <Textarea
                        placeholder="Paste your contract text here..."
                        className="min-h-[400px] resize-none focus-visible:ring-accent"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </TabsContent>
                    <TabsContent value="upload" className="mt-4">
                      <div 
                        className="h-[400px] border-2 border-dashed rounded-md flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={handleFileUpload} />
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium">Click to upload .txt file</p>
                        {fileName && (
                          <div className="mt-4 p-2 bg-muted rounded-md flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-xs truncate max-w-[150px]">{fileName}</span>
                            <X className="h-3 w-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); setFileName(null); setContent(""); }} />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isLoading} 
                    className="w-full bg-accent hover:bg-accent/90 h-12"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Risks...
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Run Risk Scan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {!analysis && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center py-20 bg-muted/20 border border-dashed rounded-xl text-muted-foreground/60">
                  <ShieldQuestion className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Ready to scan your contract</p>
                  <p className="text-sm">Identify unfavorable terms and hidden liabilities</p>
                </div>
              )}

              {isLoading && (
                <div className="space-y-4">
                  <Card className="animate-pulse">
                    <CardHeader className="h-24 bg-muted/50" />
                    <CardContent className="h-64 bg-muted/30" />
                  </Card>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-primary bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Risk Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-slate-700">{analysis.summary}</p>
                    </CardContent>
                  </Card>

                  <h3 className="text-lg font-headline font-semibold flex items-center gap-2">
                    Identified Issues ({analysis.risks.length})
                  </h3>

                  <div className="space-y-4">
                    {analysis.risks.map((risk, idx) => (
                      <Card key={idx} className="overflow-hidden border-l-4" style={{ 
                        borderLeftColor: risk.severity === 'High' ? '#ef4444' : risk.severity === 'Medium' ? '#f59e0b' : '#3b82f6'
                      }}>
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={risk.severity === 'High' ? 'destructive' : risk.severity === 'Medium' ? 'secondary' : 'outline'}>
                              {risk.severity} Severity
                            </Badge>
                          </div>
                          <AlertCircle className={`h-5 w-5 ${risk.severity === 'High' ? 'text-red-500' : risk.severity === 'Medium' ? 'text-amber-500' : 'text-blue-500'}`} />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="bg-muted/30 p-4 rounded-md border text-xs font-mono italic text-muted-foreground overflow-x-auto">
                            "{risk.clause}"
                          </div>
                          <div>
                            <p className="font-semibold text-sm mb-1 text-primary">Implication & Guidance</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{risk.explanation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {analysis.risks.length === 0 && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="py-12 flex flex-col items-center justify-center">
                        <ShieldCheck className="h-16 w-16 text-green-500 mb-4" />
                        <p className="text-xl font-headline font-bold text-green-700">Clean Bill of Health</p>
                        <p className="text-sm text-green-600">No major risks identified in this document.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
