import WeaponCard from "@/components/cards/WeaponCard";
import { useBuildStore } from "@/providers/BuildStoreProvider";

export default function WeaponViewer() {
	const weapon = useBuildStore((state) => state.weapon);
	const setSelectedSlot = useBuildStore((state) => state.setSelectedSlot);

	return <WeaponCard weapon={weapon} onClick={() => setSelectedSlot("weapon")} />;
}
