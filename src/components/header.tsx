import Link from "next/link"

const Header = () => {
	return (
		<div className={"flex items-center justify-center p-4 px-6 text-center font-mono text-white"}>
			<Link href="/">ueplugin.directory </Link>
		</div>
	)
}

export { Header }
