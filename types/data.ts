export type SupportedDescendant = {
	name: string;
	crit_damage: number;
	crit_rate: number;
	skills: SupportedDescendantSkiil[];
};

export type SupportedDescendantSkiil = {
	skill_name: string;
	reload?: number;
	MP_cost?: number;
	damage_percentage?: number;
	range?: number;
	max_range_percentage?: number;
	duration?: number;
	effects?: {
		label: string;
		duration: number;
		value: number;
	}[];
	tick_MP_cost?: number;
	tick_damage_percentage?: number;
	tick_duration?: number;
	tick_interval?: number;
	tick_range?: number;
	tick_max_range_percentage?: number;
	other_skill_tick_damage_percentage?: number;
	other_skill_tick_duration?: number;
	other_skill_tick_interval?: number;
};

export type ModuleSupplementData = {
	namePattern?: string;
	explanation?: string;
	subClass?: ModuleSubClass;
	effects?: Effect[];
	supported?: boolean;
};

export type Effect = {
	name: string;
	value: number;
	flat?: boolean;
};

export type Stat = {
	name: string;
	value: number;
};

export type ModuleSubClass =
	| {
			type: "transcendent";
			id: string[];
	  }
	| {
			type: "subAttack";
	  };

export type ResistanceType = "def" | "nonA" | "fire" | "chill" | "electric" | "toxic";

export type Enemy = {
	name: string;
	resistance: Record<ResistanceType, number>;
	critResistance: {
		skill: number;
		gun: number;
	};
};

export type EnemiesGroup = {
	label: string;
	enemies: Enemy[];
};
