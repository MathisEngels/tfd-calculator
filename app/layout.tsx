import Providers from "@/providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "The First Descendant Calculator",
	description: "User-friendly tool to calculate TFD damage.",
	authors: [{ name: "Mathis Engels", url: "https://mathisengels.fr" }],
	creator: "Mathis Engels",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
