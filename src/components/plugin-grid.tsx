import { classifyAge } from "@/lib/age-check"
import { classifyLicense, ratingReasons } from "@/lib/license-check"
import { timeago } from "@/lib/timeago"
import { StarIcon } from "lucide-react"
import { Corner } from "./corner"
import { Rating } from "./rating"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { PlatformIcon } from "./platform-icon"

export function PluginGrid({ plugins }: { plugins: any[] }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 justify-center w-full">
			{plugins.map((plugin) => {
				const license = classifyLicense(plugin?.githubLicense || "")
				const age = classifyAge(plugin?.githubPushedAt)
				return (
					<a
						href={`/${plugin.owner}/${plugin.name}`}
						key={plugin.id}
						className="flex flex-col relative group gap-2 border p-4 w-full bg-accent/30 hover:bg-accent/50 hover:text-accent-foreground transition-colors hover:!no-underline shadow-(--inset-shadow)"
					>
						<Corner
							position="topleft"
							className="before:bg-foreground/20 after:bg-foreground/20 group-hover:before:bg-current group-hover:after:bg-current"
						/>
						<Corner
							position="topright"
							className="before:bg-foreground/20 after:bg-foreground/20 group-hover:before:bg-current group-hover:after:bg-current"
						/>
						<Corner
							position="bottomleft"
							className="before:bg-foreground/20 after:bg-foreground/20 group-hover:before:bg-current group-hover:after:bg-current"
						/>
						<Corner
							position="bottomright"
							className="before:bg-foreground/20 after:bg-foreground/20 group-hover:before:bg-current group-hover:after:bg-current"
						/>

						<div className="flex gap-2 justify-between">
							<div className="flex gap-2 items-center">
								{plugin.uePluginIcon ? (
									<div className="overflow-hidden w-[34px] h-[34px] flex justify-center items-center shrink-0">
										<img src={plugin.uePluginIcon} alt="Plugin Icon" width={"100%"} height={"100%"} />
									</div>
								) : null}
								<div className="flex flex-col">
									<div className="text-md font-bold max-w-[230px] overflow-ellipsis truncate text-gray-200 ">{plugin.name}</div>
									<div className="text-xs text-gray-600 max-w-[230px] overflow-ellipsis truncate font-mono">By {plugin.owner}</div>
								</div>
							</div>
							<div className="flex justify-center items-center text-gray-600">
								<StarIcon className="h-[16px]"  />
								{plugin.githubStars}
							</div>
						</div>
						<div className="flex justify-between items-center">
							<div className="text-sm text-gray-200 overflow-ellipsis truncate max-h-[24px]">
								{plugin.description}
							</div>
						</div>
						<div className="flex justify-between items-center">
							<div className="flex items-center">
								<Tooltip>
									<TooltipTrigger>
										<Rating
											title={`License is ${ratingReasons[license.rating] || "Unknown"}`}
											rating={license.rating}
											color={license.color}
											className="h-[20px] w-[20px] mr-2 bg-background text-[10px]"
										/>
									</TooltipTrigger>
									<TooltipContent>{`License is ${ratingReasons[license.rating] || "Unknown"}`}</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger>
										<Rating
											title={`Last commit ${timeago(plugin.githubPushedAt)}`}
											rating={age.rating}
											color={age.color}
											className="h-[20px] w-[20px] mr-2 bg-background text-[10px]"
										/>
									</TooltipTrigger>
									<TooltipContent>{`Last commit ${timeago(plugin.githubPushedAt)}`}</TooltipContent>
								</Tooltip>
							</div>
							<div className="flex items-center">
								{plugin.uePluginInfo?.SupportedTargetPlatforms?.map((platform: string) => {
									return (
										<PlatformIcon
											key={platform}
											platform={platform}
											className="h-[20px] w-[20px] mr-2 text-gray-600 text-[10px]"
										/>
									)
								})}
							</div>
						</div>
					</a>
				)
			})}

			{plugins.length === 0 ? (
				<>
					<div />
					<div className="flex justify-center items-center w-full h-[200px]">No plugins found</div>
					<div />
				</>
			) : null}
		</div>
	)
}
