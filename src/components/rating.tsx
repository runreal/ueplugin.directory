import { cn } from "@/lib/utils"

export function Rating({ rating, color }: { rating: string; color: string }) {
	return (
		<div
			className={cn("flex font-bold h-[24px] w-[24px] justify-center items-center mr-3 shrink-0")}
			style={{ color, borderColor: color, borderWidth: 2, borderRadius: "50%" }}
		>
			{rating}
		</div>
	)
}
