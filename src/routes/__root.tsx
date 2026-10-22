import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import "../styles.css";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "RWD Studio — Code, craft & curiosity" },
			{
				name: "description",
				content:
					"RWD Studio is a multidisciplinary creative studio. Software, design, film, photography, animation, and illustration. From the first idea to the final detail.",
			},
			{ name: "theme-color", content: "#f3f2e9" },
			{ property: "og:title", content: "RWD Studio — Serious about play." },
			{
				property: "og:description",
				content:
					"Independent minds. Shared ambition. We bring ideas to life through code, craft, and storytelling.",
			},
			{ property: "og:type", content: "website" },
		],
		links: [
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
		],
	}),
	shellComponent: RootDocument,
});
function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
