import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
	return (
		<div className={cn("flex w-full flex-col p-8 border-t border-dashed mt-auto", className)}>
			<div className="w-full m-auto text-sm text-center font-mono">
				Powered by{" "}
				<a href="https://runreal.dev" target="_blank" rel="noopener noreferrer">
					runreal.dev
				</a>
			</div>
			<div className="w-full m-auto text-sm text-center text-muted-foreground mt-3">
				This is not an official Epic Games Unreal Engine project.
				<br />
				Unreal Engine is a registered trademark of{" "}
				<a href="https://www.epicgames.com/" target="_blank" rel="noopener noreferrer">
					Epic Games, Inc.
				</a>
			</div>
		</div>
	)
}
