import { FancyButton } from "@/components/fancy-button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Pagination } from "@/components/pagination";
import { PluginGrid } from "@/components/plugin-grid";
import { Topbar } from "@/components/topbar";
import { trpc } from "@/trpc/server";
import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";



export const metadata: Metadata = {
  title: 'The Unreal Plugin Registry',
  description: 'Discover, share, and contribute to open-source Unreal Engine plugins',
}


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
			<Topbar showSearch={false} />
			<Hero />

      <div className="flex flex-col gap-4 max-w-[1200px] w-full m-h-fulr m-auto mt-8 px-8">
        <div className="flex items-center justify-between mt-8">
          <div className="text-xl font-medium font-mono">
            {search ? <span>Seach Results</span> : <span>Popular Plugins</span>}
          </div>
          <a href="https://github.com/runreal/plugin.registry/issues/new?template=request_plugin.yml" target="_blank" rel="noreferrer">
          <FancyButton
            size="large"
            className="uppercase font-mono text-gray-200"
            icon={() => <PlusIcon className="h-5 w-5 ml-2 mb-[2px]" />}
          >
            Submit
          </FancyButton>
          </a>
        </div>
        <PluginGrid plugins={data} />

				{data.length >= 99 || offset > 1 ? (
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
