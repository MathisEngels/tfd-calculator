import ModuleCard from "@/components/cards/ModuleCard";
import { cn } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Mode } from "@/types";

interface Props {
	mode: Mode;
}

export default function ModuleViewer({ mode }: Props) {
	const mods = useBuildStore((state) => state.module);
	const selectedIndex = useBuildStore((state) => (mode === "descendant" ? state.indexDescendantModuleSlotSelected : state.indexWeaponModuleSlotSelected));
	const removeModule = useBuildStore((state) => state.removeModule);
	const setSelectedSlot = useBuildStore((state) => state.setSelectedSlot);

	return (
		<div className={cn("grid gap-2", mode === "descendant" ? "grid-cols-6" : "grid-cols-5")}>
			{[...Array(mode === "descendant" ? 12 : 10)].map((_, index) => {
				return (
					<ModuleCard
						key={index}
						onClick={() => setSelectedSlot("module", mode, index)}
						selected={selectedIndex === index}
						module={mods[mode][index]}
						onClose={() => removeModule(mode, index)}
					/>
				);
			})}
		</div>
	);
}
