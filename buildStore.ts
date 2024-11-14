import { extractAll, extractForWeapon } from "@/lib/utils";
import { createStore } from "zustand";
import {
	Arche,
	Descendant,
	Effect,
	Enemy,
	ExternalComponent,
	ExternalComponentType,
	ExternalComponents,
	Mode,
	Module,
	PenetrationType,
	Reactor,
	Stat,
	Type,
	Weapon,
} from "./types";

export type BuildState = {
	mode: Mode;
	against: {
		enemy: Enemy;
		penetration: PenetrationType;
	};
	descendant: Descendant | null;
	skillEffects: {
		label: string;
		effect: Effect;
	}[];
	descendantEffects: Effect[];
	descendantStats: Stat[];
	reactor: Reactor;
	externalComponents: ExternalComponents;
	weapon: Weapon | null;
	weaponEffects: Effect[];
	module: {
		descendant: (Module | null)[];
		weapon: (Module | null)[];
	};
	isWeaponSlotSelected: boolean;
	isDescendantSlotSelected: boolean;
	isReactorSlotSelected: boolean;
	isAuxiliaryPowerSlotSelected: boolean;
	isSensorSlotSelected: boolean;
	isMemorySlotSelected: boolean;
	isProcessorSlotSelected: boolean;
	isDescendantModuleSlotSelected: boolean;
	isTrancendentModuleSlotSelected: boolean;
	isSubAtkModuleSlotSelected: boolean;
	isWeaponModuleSlotSelected: boolean;
	indexDescendantModuleSlotSelected: number;
	indexWeaponModuleSlotSelected: number;
};

export type SlotType = "descendant" | "reactor" | "external" | "module" | "weapon";

type BuildAction = {
	setMode: (mode: BuildState["mode"]) => void;
	setEnemy: (enemy: Enemy) => void;
	setPenetrationType: (penetration: PenetrationType) => void;
	setEnemyAndPenetrationType: (enemy: Enemy, penetration: PenetrationType) => void;
	setDescendant: (descendant: Descendant) => void;
	setReactor: (prop: keyof Reactor, val: Reactor[keyof Reactor]) => void;
	setExternalComponent: (type: keyof ExternalComponents, component: ExternalComponent) => void;
	setWeapon: (weapon: Weapon) => void;
	setDescendantModule: (module: Module) => void;
	removeModule: (moduleType: Mode, index: number) => void;
	resetWeaponModule: () => void;
	setWeaponModule: (module: Module) => void;
	setSelectedSlot: (type: SlotType, subType?: ExternalComponentType | Mode, index?: number) => void;
	addSkillEffect: (label: string, effectLabel: Effect["name"], effectValue: Effect["value"]) => void;
	removeSkillBuff: (label: string) => void;
};

export type BuildStore = BuildState & BuildAction;

const initState: BuildState = {
	mode: "descendant",
	against: {
		enemy: {
			name: "Immortality",
			resistance: {
				def: 202,
				nonA: 202,
				fire: 135,
				electric: 202,
				chill: 135,
				toxic: 101,
			},
			critResistance: {
				skill: 5,
				gun: 5,
			},
		},
		penetration: "burst",
	},
	descendant: null,
	skillEffects: [],
	descendantEffects: [],
	descendantStats: [
		{
			name: "Max HP",
			value: 1130,
		},
	],
	reactor: {
		name: "Materialized Phase Reactor",
		tier: "ultimate",
		optimized: false,
		optimizationMultiplier: 1,
		lvl: 0,
		arche: "dimension",
		type: "non-attribute",
		subStat: [null, null],
	},
	externalComponents: {
		auxiliaryPower: {
			external_component_id: "241001001",
			external_component_name: "HP Support Auxiliary Power",
			image_url: "https://open.api.nexon.com/static/tfd/img/cc2fbed9ea081393b7162df70a4eed66",
			external_component_equipment_type: "Auxiliary Power",
			set_effects: [],
			stat_type: "Max HP",
			stat_value: 323,
			set_name: "HP Support",
			subStat: [null, null],
			external_component_tier: "normal",
		},
		sensor: {
			external_component_id: "242001001",
			external_component_name: "HP Support Sensor",
			image_url: "https://open.api.nexon.com/static/tfd/img/e8a268af2968e907408e5d77125460f7",
			external_component_equipment_type: "Sensor",
			set_effects: [],
			stat_type: "Max HP",
			stat_value: 323,
			set_name: "HP Support",
			subStat: [null, null],
			external_component_tier: "normal",
		},
		memory: {
			external_component_id: "243001001",
			external_component_name: "HP Support Memory",
			image_url: "https://open.api.nexon.com/static/tfd/img/2e558d42ff30b01656abca95180e621f",
			external_component_equipment_type: "Memory",
			set_effects: [],
			stat_type: "Max HP",
			stat_value: 161,
			set_name: "HP Support",
			subStat: [null, null],
			external_component_tier: "normal",
		},
		processor: {
			external_component_id: "244001001",
			external_component_name: "HP Support Processor",
			image_url: "https://open.api.nexon.com/static/tfd/img/6d76659fc831aad1119be18615624a7c",
			external_component_equipment_type: "Processor",
			set_effects: [],
			stat_type: "Max HP",
			stat_value: 323,
			set_name: "HP Support",
			subStat: [null, null],
			external_component_tier: "normal",
		},
	},
	weapon: null,
	weaponEffects: [],
	module: {
		descendant: Array(12).fill(null),
		weapon: Array(10).fill(null),
	},
	isWeaponSlotSelected: false,
	isDescendantSlotSelected: true,
	isReactorSlotSelected: false,
	isAuxiliaryPowerSlotSelected: false,
	isSensorSlotSelected: false,
	isMemorySlotSelected: false,
	isProcessorSlotSelected: false,
	isDescendantModuleSlotSelected: false,
	isTrancendentModuleSlotSelected: false,
	isSubAtkModuleSlotSelected: false,
	isWeaponModuleSlotSelected: false,
	indexDescendantModuleSlotSelected: -1,
	indexWeaponModuleSlotSelected: -1,
};

export const createBuildStore = () => {
	return createStore<BuildStore>()((set) => ({
		...initState,
		setMode: (mode) => set(() => ({ mode })),
		setEnemy: (enemy) => set(() => ({ against: { ...initState.against, enemy } })),
		setPenetrationType: (penetration) => set(() => ({ against: { ...initState.against, penetration } })),
		setEnemyAndPenetrationType: (enemy, penetration) => set(() => ({ against: { enemy, penetration } })),
		setDescendant: (descendant) => set(() => ({ descendant })),
		setReactor: (prop, value) =>
			set((state) => {
				const newReactor: Reactor = { ...state.reactor, [prop]: value };

				if (prop === "type" || prop === "arche") {
					newReactor.name = getReactorName(newReactor.type, newReactor.arche);
				}
				if (prop === "optimized") {
					newReactor.optimizationMultiplier = !value || newReactor.tier === "normal" ? 1 : newReactor.tier === "rare" ? 1.4 : 1.6;
				}
				if (prop === "tier") {
					newReactor.optimizationMultiplier = !newReactor.optimized || value === "standard" ? 1 : value === "rare" ? 1.4 : 1.6;
				}

				const { effects, stats } = extractAll(state.module.descendant, state.externalComponents, newReactor, state.skillEffects);

				return { descendantEffects: effects, descendantStats: stats, reactor: newReactor };
			}),
		setExternalComponent: (type, component) =>
			set((state) => {
				const newExternalComponents = { ...state.externalComponents, [type]: component };
				const { effects, stats } = extractAll(state.module.descendant, newExternalComponents, state.reactor, state.skillEffects);

				return { descendantEffects: effects, descendantStats: stats, externalComponents: newExternalComponents };
			}),
		setWeapon: (weapon) =>
			set((state) => {
				const weaponEffects = extractForWeapon(weapon, state.module.weapon);
				return { weapon, weaponEffects };
			}),
		setDescendantModule: (module) =>
			set((state) => {
				if (!state.isDescendantModuleSlotSelected && !state.isTrancendentModuleSlotSelected && !state.isSubAtkModuleSlotSelected)
					return { module: state.module };

				const newDescModArr = [...state.module.descendant];

				const index = state.isTrancendentModuleSlotSelected ? 0 : state.isSubAtkModuleSlotSelected ? 6 : state.indexDescendantModuleSlotSelected;
				newDescModArr[index] = module;

				const { effects, stats } = extractAll(newDescModArr, state.externalComponents, state.reactor, state.skillEffects);

				return {
					descendantEffects: effects,
					descendantStats: stats,
					module: { ...state.module, descendant: newDescModArr },
				};
			}),
		removeModule: (moduleType, index) => {
			set((state) => {
				const newModArr = [...state.module[moduleType]];
				newModArr[index] = null;

				if (moduleType === "descendant") {
					const { effects, stats } = extractAll(newModArr, state.externalComponents, state.reactor, state.skillEffects);

					return {
						descendantEffects: effects,
						descendantStats: stats,
						module: { ...state.module, descendant: newModArr },
					};
				} else {
					const weaponEffects = extractForWeapon(state.weapon!, newModArr);

					return { module: { ...state.module, weapon: newModArr }, weaponEffects };
				}
			});
		},
		resetWeaponModule: () => set((state) => ({ module: { ...state.module, weapon: Array(10).fill(null) } })),
		setWeaponModule: (module) =>
			set((state) => {
				if (!state.isWeaponModuleSlotSelected) return { module: state.module };

				const newWeapModArr = [...state.module.weapon];

				newWeapModArr[state.indexWeaponModuleSlotSelected] = module;

				const weaponEffects = extractForWeapon(state.weapon!, newWeapModArr);

				return { module: { ...state.module, weapon: newWeapModArr }, weaponEffects };
			}),
		setSelectedSlot: (type, subType, index) => {
			set(() => {
				const newState = {
					isWeaponSlotSelected: false,
					isDescendantSlotSelected: false,
					isReactorSlotSelected: false,
					isAuxiliaryPowerSlotSelected: false,
					isSensorSlotSelected: false,
					isMemorySlotSelected: false,
					isProcessorSlotSelected: false,
					isDescendantModuleSlotSelected: false,
					isTrancendentModuleSlotSelected: false,
					isSubAtkModuleSlotSelected: false,
					isWeaponModuleSlotSelected: false,
					indexDescendantModuleSlotSelected: -1,
					indexWeaponModuleSlotSelected: -1,
				};

				if (type === "module" && index !== undefined) {
					newState.isDescendantModuleSlotSelected = subType === "descendant";
					newState.isWeaponModuleSlotSelected = subType === "weapon";
					newState.indexDescendantModuleSlotSelected = subType === "descendant" ? index : -1;
					newState.indexWeaponModuleSlotSelected = subType === "weapon" ? index : -1;
					newState.isTrancendentModuleSlotSelected = subType === "descendant" && index === 0;
					newState.isSubAtkModuleSlotSelected = subType === "descendant" && index === 6;
				} else if (type === "external") {
					const subT = subType as "auxiliaryPower" | "sensor" | "memory" | "processor";

					newState.isAuxiliaryPowerSlotSelected = subT === "auxiliaryPower";
					newState.isSensorSlotSelected = subT === "sensor";
					newState.isMemorySlotSelected = subT === "memory";
					newState.isProcessorSlotSelected = subT === "processor";
				} else {
					newState.isDescendantSlotSelected = type === "descendant";
					newState.isReactorSlotSelected = type === "reactor";
					newState.isWeaponSlotSelected = type === "weapon";
				}

				return newState;
			});
		},
		addSkillEffect: (label, name, value) =>
			set((state) => {
				if (state.skillEffects.some((buff) => buff.label === label)) return state;

				const effect = { name, value };
				const newSkillBuffs = [...state.skillEffects, { label, effect }];
				const { effects, stats } = extractAll(state.module.descendant, state.externalComponents, state.reactor, newSkillBuffs);

				return { descendantEffects: effects, descendantStats: stats, skillEffects: newSkillBuffs };
			}),
		removeSkillBuff: (label) => {
			set((state) => {
				const newSkillBuffs = state.skillEffects.filter((buff) => buff.label !== label);
				const { effects, stats } = extractAll(state.module.descendant, state.externalComponents, state.reactor, newSkillBuffs);

				return { descendantEffects: effects, descendantStats: stats, skillEffects: newSkillBuffs };
			});
		},
	}));
};

function getReactorName(type: Type, arche: Arche) {
	const typeNames = {
		"non-attribute": "Materialized",
		fire: "Burning",
		chill: "Frozen",
		electric: "Tingling",
		toxic: "Toxic",
	};

	const archeNames = {
		dimension: "Phase",
		fusion: "Mixture",
		singular: "Singularity",
		tech: "Mechanics",
	};

	return `${typeNames[type]} ${archeNames[arche]} Reactor`;
}
