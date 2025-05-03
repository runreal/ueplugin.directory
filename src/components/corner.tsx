import { cva, cx } from "class-variance-authority"

const cornerStyles = cva(
	"corner-component absolute w-2 h-2 transition-transform duration-150 ease-out-expo before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[1px] before:bg-current before:z-5 after:content-[''] after:absolute after:top-0 after:left-0 after:w-[1px] after:h-full after:bg-current after:z-5",
	{
		variants: {
			position: {
				topleft:
					"top-0 left-0 -translate-x-[0.5px] -translate-y-[0.5px] group-hover:translate-x-[-1.5px] group-hover:translate-y-[-1.5px] group-focus:translate-x-[-1.5px] group-focus:translate-y-[-1.5px] group-active:translate-x-[0.5px] group-active:translate-y-[0.5px]",
				topright:
					"top-0 right-0 translate-x-[0.5px] -translate-y-[0.5px] rotate-90 group-hover:translate-x-[1.5px] group-hover:translate-y-[-1.5px] group-focus:translate-x-[1.5px] group-focus:translate-y-[-1.5px] group-active:translate-x-[-0.5px] group-active:translate-y-[0.5px]",
				bottomleft:
					"bottom-0 left-0 -translate-x-[0.5px] translate-y-[0.5px] -rotate-90 group-hover:translate-x-[-1.5px] group-hover:translate-y-[1.5px] group-focus:translate-x-[-1.5px] group-focus:translate-y-[1.5px] group-active:translate-x-[0.5px] group-active:translate-y-[-0.5px]",
				bottomright:
					"bottom-0 right-0 translate-x-[0.5px] translate-y-[0.5px] rotate-180 group-hover:translate-x-[1.5px] group-hover:translate-y-[1.5px] group-focus:translate-x-[1.5px] group-focus:translate-y-[1.5px] group-active:translate-x-[-0.5px] group-active:translate-y-[-0.5px]",
			},
		},
	},
)

export function Corner({
	position,
	className,
}: {
	position: "topleft" | "topright" | "bottomleft" | "bottomright"
	className?: string
}) {
	return <span className={cx(cornerStyles({ position }), className)} />
}
