export async function register() {
	// Node.js 25+ exposes localStorage as a built-in global, but Turbopack
	// passes --localstorage-file without a valid path, leaving a broken
	// Storage object whose methods are not functions. Libraries that gate on
	// `typeof localStorage !== 'undefined'` (e.g. next-themes) then crash
	// during SSR. Remove the broken global so those guards work correctly.
	try {
		if (typeof globalThis.localStorage !== "undefined" && typeof globalThis.localStorage.getItem !== "function") {
			// @ts-expect-error — intentionally removing the broken built-in
			delete globalThis.localStorage
		}
	} catch {
		// Storage global may be non-configurable in future engines; ignore.
	}

	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { getWorld } = await import("workflow/runtime")
		await getWorld().start?.()
	}
}
