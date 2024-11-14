"use client";

import { BuildStore, createBuildStore } from "@/buildStore";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

type BuildStoreApi = ReturnType<typeof createBuildStore>;

export const BuildStoreContext = createContext<BuildStoreApi | undefined>(undefined);

export const BuildStoreProvider = ({ children }: { children: React.ReactNode }) => {
	const storeRef = useRef<BuildStoreApi>(undefined);
	if (!storeRef.current) {
		storeRef.current = createBuildStore();
	}

	return <BuildStoreContext.Provider value={storeRef.current}>{children}</BuildStoreContext.Provider>;
};

export const useBuildStore = <T,>(selector: (store: BuildStore) => T): T => {
	const buildStoreContext = useContext(BuildStoreContext);

	if (!buildStoreContext) {
		throw new Error(`useBuildStore must be used within BuildStoreProvider`);
	}

	return useStore(buildStoreContext, selector);
};
