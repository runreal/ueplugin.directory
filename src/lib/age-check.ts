import { colors } from "./license-check"

const millisecondsPerMonth = 1000 * 60 * 60 * 24 * 30

export function classifyAge(date: Date | string | null): { rating: string; color: string } {
	if (!date) {
		return { rating: "-", color: colors.red } // Red
	}
	const inputDate = typeof date === "string" ? new Date(date) : date

	if (!(inputDate instanceof Date) || Number.isNaN(inputDate.getTime())) {
		throw new Error("Invalid date provided")
	}

	const currentDate = new Date()
	const diffInMilliseconds = currentDate.getTime() - inputDate.getTime()

	const diffInMonths = diffInMilliseconds / millisecondsPerMonth

	// Classify based on the specified ranges
	if (diffInMonths < 2) {
		return { rating: "A+", color: colors.green } // Green
	}
	if (diffInMonths < 9) {
		return { rating: "A", color: colors.green } // Green
	}
	if (diffInMonths < 18) {
		// 1.5 years = 18 months
		return { rating: "B", color: colors.lightGreen } // Yellow-green
	}
	if (diffInMonths < 24) {
		// 2 years = 24 months
		return { rating: "C", color: colors.yellow } // Yellow
	}
	if (diffInMonths < 36) {
		// 3 years = 36 months
		return { rating: "D", color: colors.orange } // Orange
	}
	return { rating: "F", color: colors.red } // Red
}
