import { db } from "@/db"
import { plugins } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { PLUGIN_DATA } from "@/plugins"
import { Octokit } from "octokit"

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

const iconPaths = ["Resources/Icon128.png"]

const pluginData = [...new Set(PLUGIN_DATA)]

// Regex patterns to find PublicDependencyModuleNames and PrivateDependencyModuleNames
const publicDepsPattern = /PublicDependencyModuleNames\.AddRange\s*\(\s*new\s+string\[\]\s*\{([^}]+)\}/g
const privateDepsPattern = /PrivateDependencyModuleNames\.AddRange\s*\(\s*new\s+string\[\]\s*\{([^}]+)\}/g
const publicDepsPattern2 = /PublicDependencyModuleNames\s*=\s*new\s+string\[\]\s*\{([^}]+)\}/g
const privateDepsPattern2 = /PrivateDependencyModuleNames\s*=\s*new\s+string\[\]\s*\{([^}]+)\}/g

function parseBuildCsDependencies(buildCsContent: string): {
	publicDependencies: string[]
	privateDependencies: string[]
} {
	const extractModules = (patterns: RegExp[]) => {
		return patterns.reduce((deps: string[], pattern) => {
			const matches = [...buildCsContent.matchAll(pattern)]
			const modules = matches.flatMap((match) => match[1].match(/"([^"]+)"/g)?.map((m) => m.replace(/"/g, "")) || [])
			return deps.concat(modules)
		}, [])
	}

	const publicPatterns = [publicDepsPattern, publicDepsPattern2]
	const privatePatterns = [privateDepsPattern, privateDepsPattern2]

	return {
		publicDependencies: [...new Set(extractModules(publicPatterns))],
		privateDependencies: [...new Set(extractModules(privatePatterns))],
	}
}

export const processPlugins = inngest.createFunction(
	{ id: "create-plugins" },
	{
		event: "plugins.create",
		// cron: 'every 1 hours',
	},
	async ({ event, step }) => {
		for (const url of pluginData) {
			await step.sleep("delay-10s", 10000)
			await step.run("queue-step", async () => {
				await inngest.send({
					name: "plugin.create",
					data: {
						url,
					},
				})
			})
		}
	},
)

export const processPlugin = inngest.createFunction(
	{ id: "create-plugin" },
	{
		event: "plugin.create",
	},
	async ({ event }) => {
		const url = event.data.url
		if (!url) return

		const repoName = url.split("/").slice(-2).join("/")
		const [owner, name] = repoName.split("/")
		const { data } = await octokit.rest.repos.get({
			owner,
			repo: name,
		})
		if (!data) {
			console.log("no repo found", owner, name)
			return
		}
		let readme = { content: "", path: "" }
		try {
			const { data: readmeData } = await octokit.rest.repos.getReadme({
				owner,
				repo: name,
				ref: data.default_branch,
			})
			readme = readmeData
		} catch (e) {
			console.log("no readme found", owner, name)
			return
		}

		const { data: treeData } = await octokit.rest.git.getTree({
			owner,
			repo: name,
			tree_sha: data.default_branch,
		})

		let uPluginFile = treeData.tree.find((file) => {
			return file.path.toLowerCase().endsWith(".uplugin")
		})

		if (!uPluginFile) {
			console.log("searching recursive", owner, data.name)

			// check full tree
			const { data: treeData } = await octokit.rest.git.getTree({
				owner,
				repo: name,
				tree_sha: data.default_branch,
				recursive: "true",
			})

			uPluginFile = treeData.tree.find((file) => {
				if (!file.path.toLowerCase().endsWith(".uplugin")) return false
				return file.path.split("/").length < 4
			})
		}
		if (!uPluginFile) {
			console.log("no uplugin file found", owner, data.name)
			return
		}

		const { data: uePluginFile } = await octokit.rest.repos.getContent({
			owner,
			repo: name,
			path: uPluginFile.path,
		})

		if (!uePluginFile) {
			console.log("no uplugin file found", owner, data.name, uPluginFile.path)
			return
		}
		const uePluginFileContent = Array.isArray(uePluginFile) ? uePluginFile[0] : uePluginFile

		// @ts-ignore
		const uePluginContent = Buffer.from(uePluginFileContent.content, "base64").toString("utf8").trim()

		let uePluginContentJson: any
		try {
			// cleanup json
			uePluginContentJson = JSON.parse(uePluginContent)
		} catch (e) {
			console.log("error parsing uplugin file", owner, data.name, uPluginFile.path, e)
			return
		}

		// Find and parse Build.cs files for module dependencies
		const { publicModuleDependencies, privateModuleDependencies } = await (async () => {
			try {
				const uPluginDir = uPluginFile.path.includes("/")
					? uPluginFile.path.substring(0, uPluginFile.path.lastIndexOf("/"))
					: ""
				const sourcePath = uPluginDir ? `${uPluginDir}/Source` : "Source"

				const { data: sourceContents } = await octokit.rest.repos
					.getContent({ owner, repo: name, path: sourcePath })
					.catch(() => ({ data: [] }))

				if (!Array.isArray(sourceContents)) {
					return { publicModuleDependencies: [], privateModuleDependencies: [] }
				}

				const dependencies = await sourceContents
					.filter((item) => item.type === "dir")
					.reduce(
						async (accPromise, item) => {
							const acc = await accPromise
							const buildCsPath = `${sourcePath}/${item.name}/${item.name}.Build.cs`
							console.log("buildCsPath", buildCsPath)

							const { data: buildCsFile } = await octokit.rest.repos
								.getContent({ owner, repo: name, path: buildCsPath })
								.catch(() => ({ data: undefined }))
							console.log("buildCsFile", buildCsFile)

							if (buildCsFile && !Array.isArray(buildCsFile)) {
								// @ts-ignore
								const buildCsContent = Buffer.from(buildCsFile.content, "base64").toString("utf8")
								const { publicDependencies, privateDependencies } = parseBuildCsDependencies(buildCsContent)
								console.log("publicDependencies", publicDependencies)
								acc.publicModuleDependencies.push(...publicDependencies)
								acc.privateModuleDependencies.push(...privateDependencies)
							}
							return acc
						},
						Promise.resolve({ publicModuleDependencies: [] as string[], privateModuleDependencies: [] as string[] }),
					)

				return {
					publicModuleDependencies: [...new Set(dependencies.publicModuleDependencies)],
					privateModuleDependencies: [...new Set(dependencies.privateModuleDependencies)],
				}
			} catch (e) {
				console.log("error finding/parsing Build.cs files", owner, data.name, e)
				return { publicModuleDependencies: [], privateModuleDependencies: [] }
			}
		})()
		console.log({ publicModuleDependencies, privateModuleDependencies })

		const { data: uPluginIcon } = await octokit.rest.repos
			.getContent({
				owner,
				repo: name,
				path: iconPaths[0],
			})
			.catch(() => ({ data: undefined }))

		const values = {
			name: data.name,
			owner: data.owner.login,
			description: data.description,
			status: data.archived ? "archived" : "active",
			readme: Buffer.from(readme.content, "base64").toString("utf8"),
			readmePath: readme.path,
			// pluginRoot: ''
			githubId: data.id,
			githubLicense: data.license?.spdx_id,
			githubBranch: data.default_branch,
			githubStars: data.stargazers_count,
			githubForks: data.forks_count,
			githubPushedAt: new Date(data.pushed_at),
			githubWebsite: data.homepage,
			// githubStatus: data.archived ? "archived" : "active",
			// githubRepoIcon: data.owner.avatar_url,
			uePluginInfo: uePluginContentJson,
			// @ts-ignore
			uePluginIcon: uPluginIcon ? uPluginIcon.download_url : undefined,
			uePluginFilePath: uPluginFile.path,
			githubOwnerAvatar: data.owner.avatar_url,
			githubTopics: data.topics,
			categories: [],
			uePluginDependencies: {
				public: publicModuleDependencies,
				private: privateModuleDependencies,
			},
			lastCheckedAt: new Date(),
			lastCheckedCommit: treeData.sha,
		}
		await db.insert(plugins).values(values).onConflictDoUpdate({
			target: plugins.githubId,
			set: values,
		})
	},
)
