import { processAllPlugins } from "@/workflows/process-plugins"
import { start } from "workflow/api"

export async function POST(request: Request) {
	const authHeader = request.headers.get("authorization")
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", { status: 401 })
	}

	const run = await start(processAllPlugins)
	return Response.json({ runId: run.runId })
}
