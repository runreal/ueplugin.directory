import { db } from "@/db"
import { plugins } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { App, Octokit } from "octokit"

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
})

const iconPaths = ["Resources/Icon128.png"]

const pluginData = [
	"https://github.com/CesiumGS/cesium-unreal",
	"https://github.com/arnaud-jamin/Cog",
	"https://github.com/ue4plugins/StreetMap",
	"https://github.com/ProjectBorealis/UEGitPlugin",
	"https://github.com/unrealcv/unrealcv",
	"https://github.com/getnamo/ZipUtility-Unreal",
	"https://github.com/TriAxis-Games/RealtimeMeshComponent",
	"https://github.com/nfrechette/acl-ue4-plugin",
	"https://github.com/pafuhana1213/KawaiiPhysics",
	"https://github.com/ArticySoftware/Articy3ImporterForUnreal",
	"https://github.com/mordentral/VRExpansionPlugin",
	"https://github.com/mordentral/AdvancedSessionsPlugin",
	"https://github.com/irajsb/UE4_Assimp",
	"https://github.com/TriAxis-Games/RealtimeMeshComponent",
	"https://github.com/Mountea-Framework/MounteaDialogueSystem",
	"https://github.com/HoussineMehnik/UE4-CustomGravityPlugin",
	"https://github.com/bw2012/UnrealSandboxTerrain",
	"https://github.com/PushkinStudio/PsRealVehicle",
	"https://github.com/mklabs/ue4-targetsystemplugin",
	"https://github.com/getnamo/WeaponTrace-Unreal",
	"https://github.com/modio/modio-ue",
	"https://github.com/ufna/VaRest",
	"https://github.com/getnamo/SocketIOClient-Unreal",
	"https://github.com/RyroNZ/UE4MasterServer",
	"https://github.com/CodeSpartan/UE4TcpSocketPlugin",
	"https://github.com/NinevaStudios/mqtt-utilities-unreal",
	"https://github.com/Tencent/sluaunreal",
	"https://github.com/rdeioris/LuaMachine",
	"https://github.com/jmgomez/NimForUE",
	"https://github.com/JanSeliv/LevelSequencerAudioTrimmer",
	"https://github.com/Noesis/UnrealPlugin",
	"https://github.com/JanSeliv/SettingsWidgetConstructor",
	"https://github.com/JanSeliv/CustomShapeButton",
	"https://github.com/getnamo/ZipUtility-Unreal",
	"https://github.com/EverNewJoy/VictoryPlugin",
	"https://github.com/coderespawn/prefabricator-ue4",
	"https://github.com/DoubleDeez/UnrealFastNoise2",
	"https://github.com/sinbad/StevesUEHelpers",
	"https://github.com/truong-bui/AsyncLoadingScreen",
	"https://github.com/getnamo/GlobalEventSystem-Unreal",
	"https://github.com/jorgenpt/Hermes",
	"https://github.com/cdpred/RedTalaria",
	"https://github.com/JanSeliv/PoolManager",
	"https://github.com/Incanta/unreal-bp-csv-parsing",
	"https://github.com/DoubleDeez/MDMetaDataEditor",
	"https://github.com/landelare/ue5coro",
]

export const processPlugins = inngest.createFunction(
	{ id: "create-plugin" },
	{
		event: "plugin.create",
		// cron: 'every 1 hours',
	},
	async ({ event }) => {
		await Promise.all(
			pluginData.map(async (url) => {
				const repoName = url.split("/").slice(-2).join("/")
				const [owner, name] = repoName.split("/")
				const { data } = await octokit.rest.repos.get({
					owner,
					repo: name,
				})
				const { data: readme } = await octokit.rest.repos.getReadme({
					owner,
					repo: name,
					ref: data.default_branch,
				})

				const { data: treeData } = await octokit.rest.git.getTree({
					owner,
					repo: name,
					tree_sha: data.default_branch,
				})

				const uPluginFile = treeData.tree.find((file) => file.path.toLowerCase().endsWith(".uplugin"))

				if (!uPluginFile) {
					console.log("no uplugin file found")
					return
				}

				const { data: uePluginFile } = await octokit.rest.repos.getContent({
					owner,
					repo: name,
					path: uPluginFile.path,
				})

				if (!uePluginFile) {
					console.log("no uplugin file found")
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
					readme: atob(readme.content),
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
			}),
		)
	},
)
