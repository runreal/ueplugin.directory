"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"

export function Topbar({ search }: { search?: string }) {
	const inputRef = useRef<HTMLInputElement>(null)

	const [value, setValue] = useState(search || "")
	const [focused, setFocused] = useState(false)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "k" && event.metaKey) {
				event.preventDefault()
				// Trigger the search input focus here
				const searchInput = inputRef.current
				if (searchInput) {
					searchInput.focus()
					searchInput.select()
				}
			}
			if (event.key === "Escape") {
				const searchInput = inputRef.current
				if (searchInput) {
					searchInput.blur()
				}
			}
			if (event.key === "Enter" && focused) {
				window.location.href = `/?search=${value}`
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [value, focused])

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setValue(value)
	}

	return (
		<div className="flex items-center justify-between p-4 px-6">
			<div className="w-[300px]">
				<a href="/">plugin.registry</a>
			</div>

			<div className="inline-flex items-center w-[400px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input hover:text-accent-foreground py-2 relative h-8 justify-start bg-muted/50 text-sm font-normal text-muted-foreground shadow-none p-0 overflow-hidden">
				<Input
					ref={inputRef}
					onChange={onSearch}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					value={value}
					type="text"
					placeholder="Search plugins..."
					className="h-8 w-full border-0 px-4 text-sm font-normal text-muted-foreground shadow-none outline-none transition-all focus-visible:outline-none focus-visible:ring-0 hover:!bg-accent focus:!bg-accent !rounded-0 focus-visible:border-0"
				/>
				<kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">⌘</span>K
				</kbd>
				{focused ? (
					<div className="absolute right-12 top-2 flex items-center gap-1 text-xs text-muted-foreground/50">
						Enter to search
					</div>
				) : null}
			</div>

			<div className="flex w-[300px] justify-end">
				<a href="http://runreal.dev" target="_blank" rel="noopener noreferrer">
					runreal.dev
				</a>
			</div>
		</div>
	)
}
