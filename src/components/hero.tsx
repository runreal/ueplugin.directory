import { SearchInput } from "./search-input"

const Hero = () => {
	return (
		<div className="w-full border-b border-foreground/20  items-center text-center flex flex-col  mt-12">
			<div className="font-bold text-4xl  max-w-[1200px] m-auto   ">The Unreal Engine Plugin Registry</div>
			<div className="text-accent-foreground/80 text-xl  max-w-[1200px] font-medium m-auto mt-2">
				Discover, share, and contribute to open-source Unreal Engine plugins.
			</div>
			<div className="mt-12 mb-24 px-4 w-full">
				<SearchInput />
			</div>
		</div>
	)
}

export { Hero }
