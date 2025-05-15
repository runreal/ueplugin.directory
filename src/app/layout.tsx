import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Roboto_Mono} from "next/font/google"
import "./globals.css"
import { TRPCProvider } from "@/trpc/client"

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets:["latin"]
})

const inter = Inter({
  variable:"--font-inter",
  subsets:["latin"]
})


export const metadata: Metadata = {
	title: "Plugin Registry",
	description: "",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="h-dvh">
			<head>
				<link rel="icon" href="/favicon.png" sizes="any" />
			</head>
			<body className={`${robotoMono.variable} ${inter.className} antialiased  dark`}>
				<ThemeProvider attribute="class" defaultTheme="dark"  disableTransitionOnChange>
					<TRPCProvider>{children}</TRPCProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
