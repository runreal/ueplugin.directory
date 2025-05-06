import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { Corner } from "./corner"

export const buttonStyles = cva(
	"cursor-pointer group mix-blend-lighten relative isolate w-fit flex items-center justify-between pointer-events-auto bg-accent/30",
	{
		variants: {
			variant: {
				default: "text-primary-text",
				highlight: "text-red-600",
			},
			disabled: {
				true: "opacity-50 cursor-not-allowed",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

const textStyles = cva("font-mono uppercase", {
	variants: {
		variant: {
			default: "text-primary-text",
			highlight: "text-red-600",
		},
		size: {
			small:
				"text-[11px] lg:text-[13px] xl:text-[14px] xl:leading-[16px] lg:leading-[16px] leading-[12px] before:content-[''] before:table before:mb-[-0.2229em] lg:before:mb-[-0.2929em] xl:before:mb-[-0.2489em] after:content-[''] after:table after:mt-[-0.157em] lg:after:mt-[-0.227em] xl:after:mt-[-0.183em]",
			large:
				"text-[15px] lg:text-[14px] xl:text-[16px] leading-[16px] before:content-[''] before:table before:mb-[-0.2108em] lg:before:mb-[-0.2489em] xl:before:mb-[-0.1775em] after:content-[''] after:table after:mt-[-0.1449em] lg:after:mt-[-0.183em] xl:after:mt-[-0.1116em]",
		},
	},
	defaultVariants: {
		size: "small",
	},
})

const contentStyles = cva("m-auto w-full flex items-center justify-center relative z-[2]", {
	variants: {
		variant: {
			default:
				"group-hover:shadow-[inset_0_-2px_16px_rgba(255,255,255,0.1)] group-hover:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.02)_100%)] group-focus:shadow-[inset_0_-2px_16px_rgba(255,255,255,0.1)] group-focus:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.02)_100%)] group-active:shadow-[inset_0_-2px_16px_rgba(255,255,255,0.1)] group-active:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.02)_100%)]",
			highlight:
				"shadow-[inset_0_-2px_16px_theme('colors.red.600'_/_0.2)] bg-[radial-gradient(circle_at_center,theme('colors.red.600'_/_0)_0%,theme('colors.red.600'_/_0.1)_100%)]",
		},
		size: {
			small: "h-8 py-[9px] px-[10px]",
			large: "h-11 py-[14px] px-[13px] xl:py-[14px] xl:px-[15px]",
		},
	},
	defaultVariants: {
		variant: "default",
	},
})

const backgroundSvg = (variant: "default" | "highlight") =>
	({
		default: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Cpath d='M0,6 L6,0' stroke='rgba(230, 230, 230, 0.7)' stroke-width='0.5'/%3E%3C/svg%3E")`,
		highlight: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Cpath d='M0,6 L6,0' stroke='rgba(229, 26, 47, 0.7)' stroke-width='0.5'/%3E%3C/svg%3E")`,
	})[variant]

export function FancyButton({
	children,
	variant = "default",
	disabled,
	className,
	size = "small",
	icon,
	...props
}: React.ComponentProps<"button"> & {
	children: React.ReactNode
	icon?: React.ElementType
	disabled?: boolean
	className?: string
	variant?: "default" | "highlight"
	size?: "small" | "large"
}) {
	const Icon = icon || null
	return (
		<button type="button" className={buttonStyles({ variant, disabled, className })} {...props} disabled={disabled}>
			<div
				className={cn(
					"absolute opacity-20 transition-opacity duration-150 inset-[3px] z-1 ease-out-expo group-active:opacity-0 group-hover:opacity-100",
				)}
				style={{ backgroundImage: backgroundSvg(variant), backgroundSize: "6px 6px" }}
			/>
			<div className={contentStyles({ variant, size })}>
				<div className="flex justify-center items-center w-max bg-[#090909] pt-[3px] pr-[1px] pb-[2px] pl-[2px] h-4">
					<span className={textStyles({ size, variant })}>{children}</span>
					{Icon && <Icon />}
				</div>
			</div>

			<Corner position="topleft" className={variant === "highlight" ? "opacity-100" : ""} />
			<Corner position="topright" className={variant === "highlight" ? "opacity-100" : ""} />
			<Corner position="bottomleft" className={variant === "highlight" ? "opacity-100" : ""} />
			<Corner position="bottomright" className={variant === "highlight" ? "opacity-100" : ""} />
		</button>
	)
}
