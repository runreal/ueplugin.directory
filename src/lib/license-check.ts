export const colors = {
	green: "#00CC00",
	lightGreen: "#66CC33",
	yellow: "#FFCC00",
	orange: "#FF9900",
	darkOrange: "#FF6600",
	red: "#FF0000",
}

export const ratingReasons: { [key: string]: string } = {
	"A+": "Most permissive",
	A: "Very permissive",
	B: "Very permissive (minimal restrictions)",
	C: "Moderately permissive (some copyleft restrictions)",
	D: "Strong copyleft",
	E: "Very restrictive",
	F: "Proprietary or extremely restricted",
}

const classifications: Record<string, { rating: string; color: string }> = {
	// A+ - Most permissive (public domain or public domain equivalent)
	"CC0-1.0": { rating: "A+", color: colors.green }, // Bright green
	UNLICENSE: { rating: "A+", color: colors.green },
	"0BSD": { rating: "A+", color: colors.green },
	"PUBLIC-DOMAIN": { rating: "A+", color: colors.green },

	// A not quite public domain but very permissive
	MIT: { rating: "A", color: colors.lightGreen },

	// B - Very permissive licenses (minimal restrictions)
	"BSD-2-CLAUSE": { rating: "B", color: colors.lightGreen }, // Green
	"BSD-3-CLAUSE": { rating: "B", color: colors.lightGreen },
	ISC: { rating: "B", color: colors.lightGreen },
	X11: { rating: "B", color: colors.lightGreen },
	ZLIB: { rating: "B", color: colors.lightGreen },
	"APACHE-2.0": { rating: "B", color: colors.lightGreen },

	// C - Moderately permissive (some copyleft restrictions)
	"MPL-2.0": { rating: "C", color: colors.yellow }, // Yellow
	"LGPL-2.1": { rating: "C", color: colors.yellow },
	"LGPL-3.0": { rating: "C", color: colors.yellow },
	"EPL-2.0": { rating: "C", color: colors.yellow },
	"MS-PL": { rating: "C", color: colors.yellow },
	"CDDL-1.0": { rating: "C", color: colors.yellow },

	// D - Strong copyleft
	"GPL-2.0": { rating: "D", color: colors.orange }, // Orange
	"GPL-3.0": { rating: "D", color: colors.orange },
	"AGPL-3.0": { rating: "D", color: colors.orange },
	"EUPL-1.2": { rating: "D", color: colors.orange },

	// E - Very restrictive licenses
	"SSPL-1.0": { rating: "E", color: colors.darkOrange }, // Dark orange
	"COMMONS-CLAUSE": { rating: "E", color: colors.darkOrange },
	"RPL-1.5": { rating: "E", color: colors.darkOrange },

	// F - Proprietary or extremely restricted
	PROPRIETARY: { rating: "F", color: colors.red }, // Red
	"ALL-RIGHTS-RESERVED": { rating: "F", color: colors.red },
	CUSTOM: { rating: "F", color: colors.red },
}

export function classifyLicense(spdxId: string): { rating: string; color: string } {
	const normalizedId = spdxId.trim().toUpperCase()

	// Remove common suffixes like -ONLY, -OR-LATER, etc.
	let lookupId = normalizedId.replace(/-ONLY$/, "").replace(/-OR-LATER$/, "")

	// Handle GPL family common variations
	if (lookupId.match(/^GPL-?V?2/)) lookupId = "GPL-2.0"
	if (lookupId.match(/^GPL-?V?3/)) lookupId = "GPL-3.0"
	if (lookupId.match(/^LGPL-?V?2/)) lookupId = "LGPL-2.1"
	if (lookupId.match(/^LGPL-?V?3/)) lookupId = "LGPL-3.0"
	if (lookupId.match(/^AGPL-?V?3/)) lookupId = "AGPL-3.0"

	// Look up the classification
	const classification = classifications[lookupId]

	// Return the classification or a default if not found
	return classification || { rating: "-", color: "#999999" } // Gray for unknown
}
