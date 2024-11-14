import ExternalComponentConfigurator from "@/components/ExternalComponentConfigurator";
import ReactorConfigurator from "@/components/ReactorConfigurator";
import DescendantSelector from "@/components/selectors/DescendantSelector";
import ModuleSelector from "@/components/selectors/ModuleSelector";
import WeaponSelector from "@/components/selectors/WeaponSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Suspense } from "react";

export default function RightPanel() {
	const isWeaponSlotSelected = useBuildStore((state) => state.isWeaponSlotSelected);
	const isDescendantSlotSelected = useBuildStore((state) => state.isDescendantSlotSelected);
	const isReactorSlotSelected = useBuildStore((state) => state.isReactorSlotSelected);
	const isAuxiliaryPowerSlotSelected = useBuildStore((state) => state.isAuxiliaryPowerSlotSelected);
	const isSensorSlotSelected = useBuildStore((state) => state.isSensorSlotSelected);
	const isMemorySlotSelected = useBuildStore((state) => state.isMemorySlotSelected);
	const isDescendantModuleSlotSelected = useBuildStore((state) => state.isDescendantModuleSlotSelected);
	const isWeaponModuleSlotSelected = useBuildStore((state) => state.isWeaponModuleSlotSelected);

	return (
		<div className="w-[300px]">
			<Suspense fallback={<Skeleton className="w-full h-1/2" />}>
				{isWeaponSlotSelected ? (
					<WeaponSelector />
				) : isDescendantSlotSelected ? (
					<DescendantSelector />
				) : isReactorSlotSelected ? (
					<ReactorConfigurator />
				) : isDescendantModuleSlotSelected ? (
					<ModuleSelector mode="descendant" />
				) : isWeaponModuleSlotSelected ? (
					<ModuleSelector mode="weapon" />
				) : (
					<ExternalComponentConfigurator
						type={isAuxiliaryPowerSlotSelected ? "auxiliaryPower" : isSensorSlotSelected ? "sensor" : isMemorySlotSelected ? "memory" : "processor"}
					/>
				)}
			</Suspense>
		</div>
	);
}
