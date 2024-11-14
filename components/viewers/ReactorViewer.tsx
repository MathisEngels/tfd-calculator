import { getReactorImageUrl } from "@/app/api";
import ReactorAndComponentCard from "@/components/cards/ReactorAndComponentCard";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function ReactorViewer() {
	const reactorName = useBuildStore((state) => state.reactor.name);
	const reactorTier = useBuildStore((state) => state.reactor.tier);
	const setSelectedSlot = useBuildStore((state) => state.setSelectedSlot);

	const { data } = useSuspenseQuery({
		queryKey: ["reactorImageUrl"],
		queryFn: getReactorImageUrl,
	});

	return (
		<ReactorAndComponentCard type="reactor" name={reactorName} image_url={data![reactorName]} tier={reactorTier} onClick={() => setSelectedSlot("reactor")} />
	);
}
