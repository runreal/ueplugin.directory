import { PlatformIcon } from "@/app/(dashboard)/[owner]/[plugin]/page"
import { classifyAge } from "@/lib/age-check"
import { classifyLicense, ratingReasons } from "@/lib/license-check"
import { timeago } from "@/lib/timeago"
import { StarIcon } from "lucide-react"
import { Corner } from "./corner"
import { Rating } from "./rating"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function PluginGrid({ plugins }: { plugins: any[] }) {
	return (
		<div className="flex flex-wrap gap-5 mt-8 justify-center w-full">
			{plugins.map((plugin) => {
				const license = classifyLicense(plugin?.githubLicense || "")
				const age = classifyAge(plugin?.githubPushedAt)
				return (
					<a
						href={`/${plugin.owner}/${plugin.name}`}
						key={plugin.id}
						className="flex flex-col relative group gap-2 border p-4 w-[350px] bg-accent/20 hover:bg-accent/50 hover:text-accent-foreground transition-colors hover:!no-underline"
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
							<div className="flex gap-2">
								{plugin.uePluginIcon ? (
									<div className="rounded-[50%] overflow-hidden w-[24px] h-[24px] flex justify-center items-center shrink-0">
										<img src={plugin.uePluginIcon} alt="Plugin Icon" width={24} height={24} />
									</div>
								) : null}
								<div className="text-md font-bold max-w-[230px] overflow-ellipsis truncate">{plugin.name}</div>
							</div>
							<div className="flex justify-center items-center text-muted-foreground">
								<StarIcon className="h-[16px]" />
								{plugin.githubStars}
							</div>
						</div>
						<div className="text-sm text-muted-foreground">{plugin.owner}</div>
						<div className="flex justify-between items-center">
							<div className="text-sm text-muted-foreground overflow-ellipsis truncate max-h-[24px]">
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
											className="h-[20px] w-[20px] mr-2 text-muted-foreground text-[10px]"
										/>
									)
								})}
							</div>
						</div>
					</a>
				)
			})}

			{plugins.length === 0 ? <div className="justify-center items-center">No plugins found</div> : null}
		</div>
	)
}
