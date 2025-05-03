import { sql } from "drizzle-orm"
import { bigint, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { defaults } from "./typeid"

export interface UEModule {
	Name: string
	Type?: string
	LoadingPhase?: string
	WhitelistPlatforms?: string[]
}
export interface UEPlugin {
	Name: string
	Enabled: boolean
}

export interface UEPluginDescriptor {
	FileVersion: number
	Version: number
	EngineVersion?: string
	VersionName: string
	FriendlyName?: string
	Description?: string
	Category?: string
	CreatedBy?: string
	CreatedByURL?: string
	DocsURL?: string
	MarketplaceURL?: string
	SupportURL?: string
	EnabledByDefault?: boolean
	CanContainContent?: boolean
	IsBetaVersion?: boolean
	Installed?: boolean
	IsExperimentalVersion?: boolean
	SupportedTargetPlatforms?: string[] // [ "Win64", "Mac", "Linux", "Android", "IOS" ]
	Modules?: UEModule[]
	Plugins?: UEPlugin[]
}

export interface EngineVersion {
	major: number
	minor: number
	patch: number
	changelist: number
	branch: string
	verified: boolean
}

export const plugins = pgTable(
	"plugins",
	{
		...defaults("plugins"),
		name: text("name").notNull(), // the repo name
		owner: text("owner").notNull(), // the repo owner
		description: text("description"),
		// repo contents
		// license: text("license"),
		// licensePath: text("license_path"),
		status: text("status").default("active"), // "active", "archived"
		readme: text("readme"),
		readmePath: text("readme_path"),
		changelog: text("changelog"),
		changelogPath: text("changelog_path"),
		pluginRoot: text("plugin_root"), // some plugins have the .uplugin in a subfolder
		// repo info
		githubId: bigint("github_id", { mode: "number" }).notNull(), // repo.id
		githubLicense: text("github_license"), // repo.license.spdx_id
		githubBranch: text("github_branch"), // repo.default_branch
		githubStars: bigint("github_stars", { mode: "number" }),
		githubForks: bigint("github_forks", { mode: "number" }),
		githubWebsite: text("github_website"),
		// githubStatus: text("github_status"),
		githubPushedAt: timestamp("github_pushed_at"),
		githubRepoIcon: text("github_repo_icon"),
		githubOwnerAvatar: text("github_owner_avatar"),
		githubTopics: jsonb("github_topics").$type<string[]>(),
		// ue info
		uePluginFilePath: text("ue_plugin_file_path"), // path to the .uplugin file
		uePluginInfo: jsonb("ue_plugin_info").$type<UEPluginDescriptor>(),
		uePluginIcon: text("ue_plugin_icon"), // Resources/Icon128.png
		// engineVersions: jsonb("engine_versions").$type<EngineVersion[]>(),
		// platforms: jsonb("platforms").$type<string[]>(),
		// plugin info
		categories: jsonb("categories").$type<string[]>(),
		// our cron info
		lastCheckedCommit: text("last_checked_commit"),
		lastCheckedAt: timestamp("last_checked_at").notNull().default(sql`timezone('utc', now())`),
	},
	(table) => [uniqueIndex("plugins_github_id_idx").on(table.githubId)],
)
