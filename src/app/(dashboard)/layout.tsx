import { Footer } from "@/components/footer"
import { Topbar } from "@/components/topbar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="font-mono">
			<Topbar />
			<TooltipProvider>{children}</TooltipProvider>
			<Footer />
		</div>
	)
}
