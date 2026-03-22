"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FilePlus2, Loader2, Download, Copy, RefreshCw } from "lucide-react"
import { generateLegalDocument, GenerateLegalDocumentInput } from "@/ai/flows/generate-legal-document-flow"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { t, Language } from "@/lib/translations"

export default function GeneratorPage() {
  const [formData, setFormData] = useState<GenerateLegalDocumentInput>({
    documentType: "NDA",
    clientName: "",
    otherPartyName: "",
    purpose: "",
    keyTerms: "",
    additionalInstructions: ""
  })
  const [generatedDoc, setGeneratedDoc] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const userDocQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userDocQuery);
  const lang = (userData?.language || 'en') as Language;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName) {
      toast({ title: "Required Field", description: "Company/Client name is required.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const result = await generateLegalDocument(formData)
      setGeneratedDoc(result.generatedDocument)
      toast({ title: "Success", description: "Document generated successfully!" })
    } catch (error) {
      toast({ title: "Generation Failed", description: "Failed to draft the document.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadDoc = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedDoc], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${formData.documentType}_${formData.clientName}.txt`
    document.body.appendChild(element)
    element.click()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold font-headline">{t(lang, 'generator')}</h1>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            <div className="lg:col-span-5">
              <Card className="shadow-none border h-full bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FilePlus2 className="h-4 w-4" /> {t(lang, 'draftingReq')}
                  </CardTitle>
                  <CardDescription>Fill in the details to auto-generate your professional document</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label>{t(lang, 'docType')}</Label>
                      <Select 
                        value={formData.documentType} 
                        onValueChange={(val: any) => setFormData({...formData, documentType: val})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NDA">Non-Disclosure Agreement (NDA)</SelectItem>
                          <SelectItem value="Vendor Agreement">Vendor Agreement</SelectItem>
                          <SelectItem value="Simple Contract">Simple Service Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t(lang, 'companyName')}</Label>
                        <Input 
                          placeholder="E.g., Nyay AI Pvt Ltd" 
                          value={formData.clientName}
                          onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t(lang, 'counterpartyName')}</Label>
                        <Input 
                          placeholder="E.g., Vendor Inc." 
                          value={formData.otherPartyName}
                          onChange={(e) => setFormData({...formData, otherPartyName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t(lang, 'purpose')}</Label>
                      <Input 
                        placeholder="E.g., Sharing sensitive IP for software dev" 
                        value={formData.purpose}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t(lang, 'keyTerms')}</Label>
                      <Textarea 
                        placeholder="E.g., 2-year duration, 30-day notice period..." 
                        className="min-h-[100px]"
                        value={formData.keyTerms}
                        onChange={(e) => setFormData({...formData, keyTerms: e.target.value})}
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-accent text-lg">
                      {isLoading ? <Loader2 className="animate-spin mr-2" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                      {t(lang, 'generateBtn')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7 flex flex-col h-[calc(100vh-10rem)]">
              <Card className="flex-1 shadow-none border bg-white overflow-hidden flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Generated Output</CardTitle>
                    <CardDescription>Professional draft ready for review</CardDescription>
                  </div>
                  {generatedDoc && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedDoc)}>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadDoc}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-8 border-t bg-slate-50 font-serif leading-relaxed text-slate-800 whitespace-pre-wrap select-text">
                  {!generatedDoc && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4 opacity-50">
                      <FilePlus2 className="h-20 w-20" />
                      <p className="font-medium">Complete the form to draft your document</p>
                    </div>
                  )}
                  {isLoading && (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-4 bg-muted animate-pulse rounded w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
                      ))}
                    </div>
                  )}
                  {generatedDoc && generatedDoc}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
