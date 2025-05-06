import { FancyButton } from "@/components/fancy-button"
import { Footer } from "@/components/footer"
import { Pagination } from "@/components/pagination"
import { PluginGrid } from "@/components/plugin-grid"
import { Topbar } from "@/components/topbar"
import { trpc } from "@/trpc/server"
import { PlusIcon } from "lucide-react"
import Image from "next/image"

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string
		offset?: string
	}>
}) {
	const { search, offset: strOffset } = await searchParams
	const offset = Number.parseInt(strOffset as string) || 0
	const data = await trpc.listPlugins({ search, offset })

	return (
		<div className="h-full flex flex-col">
			<img
				src={"/grid.png"}
				alt="grid"
				className="absolute top-[-200px] left-[25%] w-[50%] h-full object-cover opacity-100 z-0"
			/>

			<Topbar search={search} className="z-1" />

			<div className="w-full border-b border-foreground/20">
				<div className="font-bold text-4xl py-18 px-8 max-w-[1200px] m-auto">
					The open source Unreal Engine Plugin Registry
				</div>
			</div>

			<div className="flex flex-col gap-4 max-w-[1200px] w-full m-h-fulr m-auto mt-8">
				<div className="flex items-center justify-between mt-8 px-8">
					<div className="text-xl">{search ? <span>Seach Results</span> : <span>Popular Plugins</span>}</div>
					<FancyButton size="large" className="uppercase" icon={() => <PlusIcon className="h-5 w-5 ml-2 mb-[2px]" />}>
						Submit
					</FancyButton>
				</div>
				<PluginGrid plugins={data} />

				{data.length >= 100 || offset > 1 ? (
					<Pagination search={search} offset={offset} count={data.length} className="mt-8" />
				) : null}
			</div>

			<div className="flex flex-col items-center justify-center my-12 relative">
				<Image
					alt="Runreal muted logo"
					src={"/runreal_blueprint_light.png"}
					width={1200}
					height={200}
					className="opacity-15"
				/>
				<img
					src={"/grid.png"}
					alt="grid"
					className="absolute top-0 left-[25%] w-[50%] h-full object-cover opacity-100 z-0"
				/>
			</div>
			<Footer className="mt-8" />
		</div>
	)
}
