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
			return
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
		const uePluginContent = atob(uePluginFileContent.content)

		let uePluginContentJson: any
		try {
			uePluginContentJson = JSON.parse(JSON.stringify(uePluginContent))
		} catch (e) {
			console.log("error parsing uplugin file", owner, data.name, uPluginFile.path, e)
			return
		}

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
			readme: Buffer.from(readme.content, 'base64').toString('utf8'),
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
			lastCheckedAt: new Date(),
			lastCheckedCommit: treeData.sha,
		}
		await db.insert(plugins).values(values).onConflictDoUpdate({
			target: plugins.githubId,
			set: values,
		})
	},
)
