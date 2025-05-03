import { FancyButton } from "@/components/fancy-button"
import { Footer } from "@/components/footer"
import { PluginGrid } from "@/components/plugin-grid"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/server"
import { PlusIcon } from "lucide-react"
import Image from "next/image"

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string
	}>
}) {
	const { search } = await searchParams
	const data = await trpc.listPlugins({ search })

	return (
		<div>
			<Topbar search={search} />

			<div className="w-full border-b border-foreground/20">
				<div className="font-bold text-4xl py-18 px-8 max-w-[1200px] m-auto">
					The open source Unreal Engine Plugin Registry
				</div>
			</div>

			<div className="flex flex-col gap-4 justify-center max-w-[1200px] m-auto">
				<div className="flex items-center justify-between mt-8 px-8">
					<div className="text-xl">{search ? <span>Seach Results</span> : <span>Popular Plugins</span>}</div>
					<FancyButton size="large" className="uppercase" icon={() => <PlusIcon className="h-5 w-5 ml-2 mb-[2px]" />}>
						Submit
					</FancyButton>
				</div>
				<PluginGrid plugins={data} />
			</div>

			<div className="flex flex-col items-center justify-center my-8">
				<Image
					alt="Runreal muted logo"
					src={"/runreal_blueprint_light.png"}
					width={1200}
					height={200}
					className="opacity-15"
				/>
			</div>
			<Footer className="mt-8" />
		</div>
	)
}
