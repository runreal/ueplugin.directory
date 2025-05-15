import { Rating } from "@/components/rating"
import { classifyAge } from "@/lib/age-check"
import { classifyLicense, ratingReasons } from "@/lib/license-check"
import { timeago } from "@/lib/timeago"
import { trpc } from "@/trpc/server"
import {
	ExternalLinkIcon,
	FileImageIcon,
	FileJsonIcon,
	GithubIcon,
	JoystickIcon,
	ShoppingCartIcon,
	SquareArrowOutUpRight,
	SquareArrowUp,
	StarIcon,
} from "lucide-react"
import type { Metadata } from "next"
import type { AnchorHTMLAttributes } from "react"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import remarkGemoji from "remark-gemoji";
import { PlatformIcon } from "@/components/platform-icon"


// Using ISR to generate page
export const revalidate = 3600 // invalidate every hour

const components = {
	a: ({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
		return (
			<a
				className="text-foreground underline underline-offset-4 hover:no-underline"
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				{...props}
			/>
		)
	},
}

const markdownPlugins = [remarkGemoji, remarkGfm]
const rehypePlugins = [rehypeRaw, rehypeSanitize]

// when this breaks use https://www.fab.com/search?q=${id}
const parseMarketplaceURL = (url: string) => {
	const parsedUrl = new URL(url)
	const pathParts = parsedUrl.pathname.split("/").filter(Boolean)

	if (pathParts.length > 0) {
		const lastPart = pathParts[pathParts.length - 1]
		const id = lastPart
		if (id) {
			return `https://www.unrealengine.com/marketplace/en-US/product/${id}`
		}
	}

	return url
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{
		owner: string
		plugin: string
	}>
}): Promise<Metadata> {
	const { owner, plugin } = await params

	return {
		title: `${plugin} - runreal plugin registry`,
		description: `Discover ${plugin} by ${owner} on Runreal plugin registry for Unreal Engine`,
	}
}

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico"]

export default async function Page({
	params,
}: {
	params: Promise<{
		owner: string
		plugin: string
	}>
}) {
	const { owner, plugin: name } = await params

	const data = await trpc.getPluginByOwnerAndName({
		owner,
		name,
	})

	const repoUrl = `https://github.com/${owner}/${name}`

	const urlTransform = (url: string) => {
		console.log(url)
		if (url.startsWith("http")) {
			return url
		}

		if (IMAGE_EXTS.some((ext) => url.endsWith(ext))) {
			return `https://raw.githubusercontent.com/${owner}/${name}/${data.githubBranch}/${url}`
		}

		return `${repoUrl}/blob/${data.githubBranch}/${url}`
	}

	const license = classifyLicense(data?.githubLicense || "")
	const age = classifyAge(data?.githubPushedAt)

	return (
		<div className="flex flex-col gap-4 items-center">
			{data ? (
				<div className="flex flex-col justify-center max-w-[1200px] w-full mt-4 md:mt-24 px-4">
					{/* HEADER */}
					<div className="w-full border-b border-foreground/20">
						<div className="flex flex-col md:flex-row items-center justify-between">
							<div className="flex text-2xl md:text-4xl font-bold">
								{data.uePluginIcon ? (
									<div className="overflow-hidden w-[64px] h-[64px] flex justify-center items-center shrink-0">
										<img src={data.uePluginIcon} alt="Plugin Icon" width={64} height={64} className="rounded-md" />
									</div>
								) : null}
								<div className="ml-4 flex items-start flex-col">
									<div className="break-words text-gray-200">{data.name}</div>
									<div>
										<a href={repoUrl} target="_blank" rel="noopener noreferrer">
											<span className="flex items-center text-sm font-light text-gray-600 justify-center">
												{data.owner}/{data.name}
												<SquareArrowOutUpRight className="h-4 w-4  ml-2" />
											</span>
										</a>
									</div>
								</div>
							</div>
							<div>
								<a href={repoUrl} target="_blank" rel="noopener noreferrer">
									<span className="ml-4 text-sm font-normal text-muted-foreground justify-center items-center gap-2 flex">
										<StarIcon style={{ fill: "oklch(0.71 0 0)" }} />
										<span className="text-lg font-normal text-muted-foreground">{data.githubStars}</span>
									</span>
								</a>
							</div>
						</div>

						<div className="flex items-center justify-between my-4">
							<div className="text-sm font-bold">{data.description ? data.description : null}</div>
						</div>

						{data.githubWebsite ? (
							<div className="mb-4">
								<a
									href={data.githubWebsite}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm font-semibold text-blue-300"
								>
									{data.githubWebsite}
								</a>
							</div>
						) : null}
					</div>

					{/* COLUMN CONTENT */}
					<div className="flex flex-1 mt-4 gap-4 w-[100%] max-w-[1200px] flex-col-reverse md:flex-row">
						{/* GITHUB TAGS only on mobile, moves to sidebar on desktop */}
						{data.githubTopics?.length ? (
							<div className="p-4 bg-accent/30 border-1 border-foreground/10 md:hidden">
								<div className="mb-3 uppercase font-semibold">Tags:</div>
								<div className="flex flex-wrap">
									{data.githubTopics.map((topic: string) => (
										<div
											key={topic}
											className="text-sm font-semibold dark:bg-blue-950/30 border px-2 p-1 mb-1 dark:text-blue-300 mr-2"
										>
											{topic}
										</div>
									))}
								</div>
							</div>
						) : null}

						{/* MARKDOWN CONTENT */}
						<div
							className="readme prose prose-slate prose:font-geist prose-invert w-full bg-accent/30 p-4 mb-4 border-1 border-foreground/10 max-w-[900px] font-wrap prose-a:hover:underline prose-a:no-underline prose-a:font-semibold prose-a:text-blue-300"
							style={{
								fontFamily: "var(--font-geist)",
								color: "var(--foreground) !important",
							}}
						>
							<Markdown
								remarkPlugins={markdownPlugins}
								rehypePlugins={rehypePlugins}
								urlTransform={urlTransform}
								components={components}
							>
								{data.readme}
							</Markdown>
						</div>

						<div className="flex flex-col gap-4 w-[1px] shrink-0 text-accent-foreground/80 border border-dashed border-foreground/10" />

						{/* SIDEBAR */}
						<div className="flex flex-col gap-4 w-full md:w-[286px] shrink-0 text-accent-foreground/80">
							<div className="p-4 bg-accent/30 border-1 border-foreground/10">
								<div className="mb-3 uppercase font-semibold">info:</div>
								<div className="flex items-center text-sm">Version: {data.uePluginInfo?.VersionName || "-"}</div>
								{data.uePluginInfo?.CreatedBy ? (
									<div className="flex items-center text-sm">Creator: {data.uePluginInfo.CreatedBy}</div>
								) : null}
							</div>

							{data.uePluginInfo?.MarketplaceURL ? (
								<div className="p-4 bg-accent/30 border-1 border-foreground/10">
									<div className="flex items-center text-sm">
										<ShoppingCartIcon />
										<a
											href={parseMarketplaceURL(data.uePluginInfo.MarketplaceURL)}
											target="_blank"
											rel="noopener noreferrer"
										>
											<div className="flex items-center gap-1">
												<span className="ml-3">Marketplace</span>
												<ExternalLinkIcon className="h-[16px]" />
											</div>
										</a>
									</div>
								</div>
							) : null}

							<div className="p-4 bg-accent/30 border-1 border-foreground/10">
								<div className="flex items-center text-sm" title={ratingReasons[license.rating]}>
									<Rating rating={license.rating} color={license.color} />
									{data.githubLicense ? (
										<div className="flex flex-col">
											<span>License:</span> <span>{data.githubLicense}</span>
										</div>
									) : (
										"NO LICENSE"
									)}
								</div>
							</div>

							<div className="p-4 bg-accent/30 border-1 border-foreground/10">
								<div className="flex items-center text-sm">
									<Rating rating={age.rating} color={age.color} />
									{data.githubPushedAt ? (
										<div className="flex flex-col">
											<span>Last Commit:</span> <span>{timeago(data.githubPushedAt)}</span>
										</div>
									) : (
										"NO RECENT COMMITS"
									)}
								</div>
							</div>

							{data.uePluginInfo?.CanContainContent ? (
								<div className="p-4 bg-accent/30 border-1 border-foreground/10">
									<div className="flex items-center text-sm">
										<FileImageIcon />
										<span className="ml-3">Contains Content</span>
									</div>
								</div>
							) : null}

							{data.uePluginInfo?.Modules?.length ? (
								<div className="p-4 bg-accent/30 border-1 border-foreground/10">
									<div className="mb-3 uppercase font-semibold">modules:</div>
									{data.uePluginInfo.Modules.map((module) => (
										<div key={module.Name} className="flex items-center text-sm mt-1">
											{module.Type === "Runtime" ? (
												<JoystickIcon className="h-[16px]" />
											) : (
												<FileJsonIcon className="h-[16px]" />
											)}
											<span className="ml-2 overflow-ellipsis truncate max-w-[200px]">{module.Name}</span>
										</div>
									))}
								</div>
							) : null}

							{data.uePluginInfo?.SupportedTargetPlatforms?.length ? (
								<div className="p-4 bg-accent/30 border-1 border-foreground/10">
									<div className="mb-3 uppercase font-semibold">Target Platforms:</div>
									{data.uePluginInfo?.SupportedTargetPlatforms.map((platform) => (
										<div key={platform} className="flex items-center text-sm mt-1">
											<PlatformIcon platform={platform} className="h-[16px]" />
											<span className="ml-2 overflow-ellipsis truncate max-w-[200px]">{platform}</span>
										</div>
									))}
								</div>
							) : null}

							{data.githubTopics?.length ? (
								<div className="p-4 bg-accent/30 border-1 border-foreground/10 hidden md:block">
									<div className="mb-3 uppercase font-semibold">Tags:</div>
									<div className="flex flex-wrap">
										{data.githubTopics.map((topic: string) => (
											<div
												key={topic}
												className="text-sm font-semibold dark:bg-blue-950/30 border px-2 p-1 mb-1 dark:text-blue-300 mr-2"
											>
												{topic}
											</div>
										))}
									</div>
								</div>
							) : null}
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col justify-center max-w-[1200px] w-full">
					<div className="flex items-center justify-between p-4 w-full border-b border-foreground/20">
						<div className="text-4xl font-bold">Plugin not found</div>
					</div>
				</div>
			)}

			{/* <Tabs value={tab} onValueChange={setTab} className="w-full"> */}
			{/* <TabsList className="grid w-full grid-cols-2"> */}
			{/*   <TabsTrigger value="">README</TabsTrigger> */}
			{/*   <TabsTrigger value="license">LICENSE</TabsTrigger> */}
			{/* </TabsList> */}
			{/* </Tabs> */}
		</div>
	)
}
