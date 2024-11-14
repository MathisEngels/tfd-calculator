import Builder from "@/app/Builder";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getEnemiesGroups, getExternalComponents, getModules, getReactorImageUrl, getSupportedDescendants, getWeapons } from "./api";
import { getQueryClient } from "./get-query-client";

export default async function Home() {
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({ queryKey: ["supportedDescendants"], queryFn: getSupportedDescendants });
	queryClient.prefetchQuery({ queryKey: ["externalComponents"], queryFn: getExternalComponents });
	queryClient.prefetchQuery({ queryKey: ["modules"], queryFn: getModules });
	queryClient.prefetchQuery({ queryKey: ["reactorImageUrl"], queryFn: getReactorImageUrl });
	queryClient.prefetchQuery({ queryKey: ["weapons"], queryFn: getWeapons });
	queryClient.prefetchQuery({ queryKey: ["getEnemiesGroups"], queryFn: getEnemiesGroups });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Builder />
		</HydrationBoundary>
	);
}
