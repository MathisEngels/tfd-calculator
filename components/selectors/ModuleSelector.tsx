import { getModules } from "@/app/api";
import SearchableList from "@/components/SearchableList";
import LargeCard from "@/components/cards/LargeCard";
import ModuleCard from "@/components/cards/ModuleCard";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Mode, Module } from "@/types/calculator";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
	mode: Mode;
}

export default function ModuleSelector({ mode: mode }: Props) {
	const buildModule = useBuildStore((state) => state.module[mode]);
	const indexModule = useBuildStore((state) => (mode === "descendant" ? state.indexDescendantModuleSlotSelected : state.indexWeaponModuleSlotSelected));

	return (
		<div className="flex flex-col gap-4 w-[300px] h-full">
			<LargeCard>
				<LargeCard.Header className="w-[150px]">
					<ModuleCard module={buildModule[indexModule]} noHover />
				</LargeCard.Header>
				<LargeCard.Content>
					<p>{buildModule[indexModule]?.module_explanation}</p>
					{buildModule[indexModule]?.module_effects.map((effect) => (
						<LargeCard.Stat key={effect.name}>
							<p>{effect.name}</p>
							<p>
								{effect.value}
								{!effect.flat && "%"}
							</p>
						</LargeCard.Stat>
					))}
				</LargeCard.Content>
			</LargeCard>
			<ModuleList mode={mode} buildModule={buildModule} />
		</div>
	);
}

interface ModuleListProps {
	mode: Mode;
	buildModule: (Module | null)[];
}

function ModuleList({ mode, buildModule }: ModuleListProps) {
	const descendant = useBuildStore((state) => state.descendant);
	const weapon = useBuildStore((state) => state.weapon);
	const isTrancendentModuleSlotSelected = useBuildStore((state) => state.isTrancendentModuleSlotSelected);
	const isSubAtkModuleSlotSelected = useBuildStore((state) => state.isSubAtkModuleSlotSelected);
	const setModule = useBuildStore((state) => (mode === "descendant" ? state.setDescendantModule : state.setWeaponModule));

	const { data } = useSuspenseQuery({ queryKey: ["modules"], queryFn: getModules });

	if (isTrancendentModuleSlotSelected && !descendant) {
		return <p className="text-center">Please select a Descendant first</p>;
	}

	if (mode === "weapon" && !weapon) {
		return <p className="text-center">Please select a Weapon first</p>;
	}

	const buildModuleIds = buildModule.map((module) => module?.module_id);

	const modules = data!.filter((module) => {
		const subClass = module.module_subclass;

		if (isTrancendentModuleSlotSelected && descendant) {
			return subClass && subClass.type === "transcendent" && subClass.id.includes(descendant!.descendant_id) && !buildModuleIds.includes(module.module_id);
		} else if (isSubAtkModuleSlotSelected) {
			const subClass = module.module_subclass;
			return subClass && subClass.type === "subAttack" && !buildModuleIds.includes(module.module_id);
		} else {
			const modClass = mode === "descendant" ? "descendant" : weapon!.weapon_rounds_type.toLowerCase();
			return module.module_class.toLowerCase() === modClass && !subClass && !buildModuleIds.includes(module.module_id);
		}
	});

	return <SearchableList list={modules} type="module" onClick={(module) => setModule(module as Module)} />;
}
