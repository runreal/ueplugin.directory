import { Footer } from "@/components/footer"
import { Topbar } from "@/components/topbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="font-mono">
			<Topbar />
			{children}
			<Footer />
		</div>
	)
}
