"use client";

import React from "react";
import { BuildStoreProvider } from "./BuildStoreProvider";
import ReactQueryProvider from "./ReactQueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ReactQueryProvider>
			<BuildStoreProvider>{children}</BuildStoreProvider>
		</ReactQueryProvider>
	);
}
