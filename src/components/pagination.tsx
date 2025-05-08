"use client"

import { cn } from "@/lib/utils"
import { ArrowLeftIcon, ArrowRightIcon, Fan } from "lucide-react"
import { redirect } from "next/navigation"
import { FancyButton } from "./fancy-button"
import { Button } from "./ui/button"

const MAX_ROWS = 100

export function Pagination({
	search,
	offset,
	count,
	className,
	...props
}: React.ComponentProps<"div"> & {
	search?: string
	offset: number
	count: number
}) {
	const paginatePrev = async () => {
		if (search) {
			return redirect(`/?search=${search || ""}&offset=${offset - MAX_ROWS}`)
		}
		return redirect(`/?offset=${offset - MAX_ROWS}`)
	}

	const paginateNext = async () => {
		if (search) {
			return redirect(`/?search=${search || ""}&offset=${offset + MAX_ROWS}`)
		}
		return redirect(`/?offset=${offset + MAX_ROWS}`)
	}

	return (
		<div className={cn("flex justify-center gap-4", className)} {...props}>
			<FancyButton onClick={() => paginatePrev()} disabled={offset === 0}>
				<ArrowLeftIcon className="h-[24px]" />
			</FancyButton>
			<FancyButton onClick={() => paginateNext()} disabled={count < MAX_ROWS}>
				<ArrowRightIcon className="h-[24px]" />
			</FancyButton>
		</div>
	)
}
