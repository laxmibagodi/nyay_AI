
import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider} from '@/components/ui/sidebar';
import {Toaster} from '@/components/ui/toaster';
import {FirebaseClientProvider} from '@/firebase';
import {AuthInitializer} from '@/components/auth-initializer';
import {AuthGuard} from '@/components/auth-guard';
import {BottomNav} from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'Nyay AI - Legal Shield for Small Businesses',
  description: 'AI-powered legal assistant for contracts, risks, and guidance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground pb-[4.5rem] md:pb-0">
        <FirebaseClientProvider>
          <AuthInitializer />
          <AuthGuard>
            <SidebarProvider defaultOpen={true}>
              {children}
            </SidebarProvider>
            <BottomNav />
          </AuthGuard>
          <Toaster />
        </FirebaseClientProvider>
        <div id="recaptcha-container"></div>
      </body>
    </html>
  );
}
