import { NexonDescendant, NexonDescendantSkill, NexonExternalComponent, NexonModule, NexonStatDetail, NexonWeapon } from "./NexonAPI";
import { Effect, ModuleSubClass, SupportedDescendantSkiil } from "./data";

export type Mode = "descendant" | "weapon";
export type Tier = "ultimate" | "rare" | "normal";
export type Rarity = "all" & Tier;
export type ExternalComponentType = "auxiliaryPower" | "sensor" | "memory" | "processor";
export type Arche = "dimension" | "fusion" | "singular" | "tech";

export type SocketType = "all" | "almandine" | "cerulean" | "malachite" | "rutile" | "xantic";
export type Ammo = "General Rounds" | "Special Rounds" | "Impact Rounds" | "High-Power Rounds";
export type EnemyFaction = "colossus" | "legion of darkness" | "order of truth" | "legion of immortality";
export type PenetrationType = "crush" | "pierce" | "burst";

export type Type = "non-attribute" | "fire" | "chill" | "electric" | "toxic";
export type Attributes = "Fire" | "Chill" | "Electric" | "Toxic" | "Non-Attribute";

export type Descendant = Omit<NexonDescendant, "descendant_skill" | "descendant_stat"> & {
	crit_damage: number;
	crit_rate: number;
	descendant_skill: DescendantSkill[];
	descendant_stat: NexonStatDetail[];
};

export type DescendantSkill = NexonDescendantSkill & SupportedDescendantSkiil;

export type Weapon = Omit<NexonWeapon, "base_stat" | "firearm_atk" | "weapon_rounds_type"> &
	WeaponStat & {
		weapon_rounds_type: Ammo;
		firearm_atk: number;
		subStats: (SubStat | null)[];
	};

export type SubStat = { name: string; value: number; min: number; max: number; flat?: boolean };

export type WeaponStat = {
	fire_rate?: number;
	weak_point_damage?: number;
	max_range?: number;
	magazine_size?: number;
	reload_time?: number;
	critical_hit_rate?: number;
	critical_hit_damage?: number;
	burst?: boolean;
	crush?: boolean;
	pierce?: boolean;
};

export type Reactor = {
	name: string;
	tier: Tier;
	optimized: boolean;
	optimizationMultiplier: number;
	lvl: 0 | 1 | 2;
	arche: Arche;
	type: Type;
	subStat: (SubStat | null)[];
};

export type ExternalComponent = Omit<NexonExternalComponent, "base_stat" | "set_option_detail"> & {
	external_component_tier: Tier;
	stat_value: number;
	stat_type: string;
	set_name: string;
	subStat: (SubStat | null)[];
	set_effects: {
		effects: Effect[];
	}[];
};

export type ExternalComponents = {
	auxiliaryPower: ExternalComponent;
	sensor: ExternalComponent;
	memory: ExternalComponent;
	processor: ExternalComponent;
};

export type Module = Omit<NexonModule, "module_stat"> & {
	module_effects: Effect[];
	module_explanation?: string;
	module_subclass?: ModuleSubClass;
	module_defined?: boolean;
	supported?: boolean;
};

export type AttributesValues = {
	flatAttributeSubStat: number;
	conversionRate: number;
	attributeATKBonus: number;
	value: number;
};

export type Skill = {
	skill: DescendantSkill;
};
