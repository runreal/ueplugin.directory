import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
	return (
		<div className={cn("flex w-full p-8 border-t border-dashed mt-auto", className)}>
			<div className="flex gap-4 justify-between w-full m-auto">
				<div className="text-sm text-muted-foreground">© 2025 runreal</div>
				<a href="http://runreal.dev" target="_blank" rel="noopener noreferrer">
					runreal.dev
				</a>
			</div>
		</div>
	)
}
