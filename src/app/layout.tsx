import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Crimson_Pro } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Reader.md",
  description: "Uma experiência de leitura focada para arquivos Markdown em repositórios públicos do GitHub.",
  applicationName: "Reader.md",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reader.md",
  },
}

export const viewport: Viewport = {
  themeColor: "#fdfcfb",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${crimsonPro.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
