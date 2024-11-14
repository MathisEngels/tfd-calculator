import DescendantCard from "@/components/cards/DescendantCard";
import { useBuildStore } from "@/providers/BuildStoreProvider";

export default function DescendantViewer() {
	const descendant = useBuildStore((state) => state.descendant);
	const setSelectedSlot = useBuildStore((state) => state.setSelectedSlot);

	return <DescendantCard className="h-[175px] w-[150px]" descendant={descendant} onClick={() => setSelectedSlot("descendant")} />;
}
