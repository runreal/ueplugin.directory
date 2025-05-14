import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col font-mono h-full">
		<Header />
			<TooltipProvider>{children}</TooltipProvider>
			<Footer />
		</div>
	)
}
