import { db } from "@/db"
import { plugins } from "@/db/schema"
import { and, desc, eq, ilike, or } from "drizzle-orm"
import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../init"
export const appRouter = createTRPCRouter({
	listPlugins: baseProcedure
		.input(z.object({ search: z.string().optional(), offset: z.number().default(0).optional() }))
		.query(async (opts) => {
			return db
				.select({
					id: plugins.id,
					owner: plugins.owner,
					name: plugins.name,
					description: plugins.description,
					status: plugins.status,
					githubLicense: plugins.githubLicense,
					githubPushedAt: plugins.githubPushedAt,
					uePluginInfo: plugins.uePluginInfo,
					githubStars: plugins.githubStars,
					uePluginIcon: plugins.uePluginIcon,
				})
				.from(plugins)
				.where(
					opts.input.search
						? and(
								// eq(plugins.status, "active"),
								or(
									ilike(plugins.name, `%${opts.input.search}%`),
									ilike(plugins.owner, `%${opts.input.search}%`),
									ilike(plugins.description, `%${opts.input.search}%`),
								),
							)
						: undefined, //eq(plugins.status, "active"),
				)
				.orderBy(desc(plugins.githubStars))
				.limit(100)
				.offset(opts.input.offset || 0)
		}),
	listPluginNames: baseProcedure.query((opts) => {
		return db
			.select({
				id: plugins.id,
				name: plugins.name,
				owner: plugins.owner,
			})
			.from(plugins)
			.limit(12)
	}),
	getPluginByOwnerAndName: baseProcedure
		.input(
			z.object({
				owner: z.string(),
				name: z.string(),
			}),
		)
		.query(async (opts) => {
			const res = await db
				.select()
				.from(plugins)
				.where(and(eq(plugins.owner, opts.input.owner), eq(plugins.name, opts.input.name)))

			return res[0]
		}),
})
// export type definition of API
export type AppRouter = typeof appRouter
