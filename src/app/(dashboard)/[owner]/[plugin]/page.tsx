import { Rating } from "@/components/rating"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { classifyAge } from "@/lib/age-check"
import { classifyLicense, ratingReasons } from "@/lib/license-check"
import { timeago } from "@/lib/timeago"
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc/server"
import { faAndroid, faApple, faLinux, faWindows } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	ExternalLinkIcon,
	FileImageIcon,
	FileJsonIcon,
	GithubIcon,
	JoystickIcon,
	ShoppingCartIcon,
	StarIcon,
} from "lucide-react"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

const allowedElements = [
	"p",
	"strong",
	"em",
	"ul",
	"ol",
	"li",
	"a",
	"code",
	"pre",
	"blockquote",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"br",
	"div",
]

const markdownPlugins = [remarkGfm]
const rehypePlugins = [rehypeRaw]

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

export function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
	const platforms = {
		Win64: () => <FontAwesomeIcon icon={faWindows} className={cn("h-[24px] w-[24px]", className)} />,
		Mac: () => <FontAwesomeIcon icon={faApple} className={cn("h-[24px] w-[24px]", className)} />,
		Linux: () => <FontAwesomeIcon icon={faLinux} className={cn("h-[24px] w-[24px]", className)} />,
		IOS: () => <FontAwesomeIcon icon={faApple} className={cn("h-[24px] w-[24px]", className)} />,
		Android: () => <FontAwesomeIcon icon={faAndroid} className={cn("h-[24px] w-[24px]", className)} />,
	}

	const icon = platforms[platform as keyof typeof platforms]

	if (icon) {
		return icon()
	}

	return null
}

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
		if (url.startsWith("http")) {
			return url
		}

		return `${repoUrl}/blob/${data.githubBranch}/${url}`
	}

	// const [tab, setTab] = useQueryState("tab", { defaultValue: '' });
	//

	const license = classifyLicense(data?.githubLicense || "")
	const age = classifyAge(data?.githubPushedAt)

	return (
		<div className="flex flex-col gap-4 justify-center items-center">
			{data ? (
				<div className="flex flex-col justify-center max-w-[1200px] w-full mt-8">
					{/* HEADER */}
					<div className="w-full border-b border-foreground/20">
						<div className="flex items-center justify-between">
							<div className="flex text-4xl font-bold">
								<a href={repoUrl} target="_blank" rel="noopener noreferrer">
									{data.owner}/{data.name}
								</a>
								<span className="ml-4 text-sm font-normal text-muted-foreground justify-center items-center gap-2 flex">
									<StarIcon />
									<span className="text-sm font-normal text-muted-foreground">{data.githubStars}</span>
								</span>
							</div>
							<div>
								<a href={repoUrl} target="_blank" rel="noopener noreferrer">
									<GithubIcon />
								</a>
							</div>
						</div>

						<div className="flex items-center justify-between my-4">
							<div className="text-sm font-bold">{data.description ? data.description : null}</div>
							{data.uePluginIcon ? (
								<img src={data.uePluginIcon} alt="Plugin Icon" width={64} height={64} className="rounded-md" />
							) : null}
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

						{data.githubTopics ? (
							<div className="mb-4 flex flex-wrap">
								{data.githubTopics.map((topic: string) => (
									<div
										key={topic}
										className="text-sm font-semibold bg-blue-950/30 border px-3 p-1 mb-1 text-blue-300 mr-2"
									>
										{topic}
									</div>
								))}
							</div>
						) : null}
					</div>

					{/* COLUMN CONTENT */}
					<div className="flex flex-1 mt-4 gap-4 w-[100%] max-w-[1200px]">
						{/* MARKDOWN CONTENT */}
						<div
							className=" readme prose dark:prose-invert w-full bg-accent/30 p-4 mb-4 border-1 border-foreground/10 max-w-[900px] font-wrap overflow-scroll"
							style={{
								fontFamily: "var(--font-geist)",
								color: "var(--foreground) !important",
							}}
						>
							<Markdown
								allowedElements={allowedElements}
								remarkPlugins={markdownPlugins}
								rehypePlugins={rehypePlugins}
								urlTransform={urlTransform}
							>
								{data.readme}
							</Markdown>
						</div>

						<div className="flex flex-col gap-4 w-[1px] shrink-0 text-accent-foreground/80 border border-dashed border-foreground/10" />

						{/* SIDEBAR */}
						<div className="flex flex-col gap-4 w-[286px] shrink-0 text-accent-foreground/80">
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
									{data.githubLicense ? <span>License: {data.githubLicense}</span> : "NO LICENSE"}
								</div>
							</div>

							<div className="p-4 bg-accent/30 border-1 border-foreground/10">
								<div className="flex items-center text-sm">
									<Rating rating={age.rating} color={age.color} />
									{data.githubPushedAt ? <span>Last Commit: {timeago(data.githubPushedAt)}</span> : "NO RECENT COMMITS"}
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
