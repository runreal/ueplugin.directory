import { Footer } from "@/components/footer"
import { Topbar } from "@/components/topbar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col font-mono h-full">
			<Topbar />
			<TooltipProvider>{children}</TooltipProvider>
			<Footer />
		</div>
	)
}
