import { cn } from "@/lib/utils"

export function Rating({
	rating,
	color,
	className,
	title,
}: { rating: string; color: string; className?: string; title?: string }) {
	return (
		<div
			title={title}
			className={cn("flex font-bold h-[24px] w-[24px] justify-center items-center mr-3 shrink-0", className)}
			style={{ color, borderColor: color, borderWidth: 2, borderRadius: "50%" }}
		>
			{rating}
		</div>
	)
}
