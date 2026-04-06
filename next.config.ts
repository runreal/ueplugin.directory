import type { NextConfig } from "next"
import { withWorkflow } from "workflow/next"

const nextConfig: NextConfig = {
	serverExternalPackages: ["@vercel/queue"],
}

export default withWorkflow(nextConfig)
