import { inngest } from "@/inngest/client"
import { serve } from "inngest/next"
import { processPlugin, processPlugins, processPluginCron } from "./functions"

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [processPlugins, processPlugin, processPluginCron],
})
