export type NexonDescendant = {
	descendant_id: string;
	descendant_name: string;
	descendant_image_url: string;
	descendant_stat: NexonDescendantStat[];
	descendant_skill: NexonDescendantSkill[];
};

type NexonDescendantStat = {
	level: number;
	stat_detail: NexonStatDetail[];
};

export type NexonStatDetail = {
	stat_type: string;
	stat_value: string;
};

export type NexonDescendantSkill = {
	skill_type: string;
	skill_name: string;
	element_type: string;
	arche_type?: string;
	skill_image_url: string;
	skill_description: string;
};

export type NexonWeapon = {
	weapon_name: string;
	weapon_id: string;
	image_url: string;
	weapon_type: string;
	weapon_tier: string;
	weapon_rounds_type: string;
	base_stat: NexonBaseStat[];
	firearm_atk: NexonFirearmAtk[];
	weapon_perk_ability_name: string;
	weapon_perk_ability_description: string;
	weapon_perk_ability_image_url: string;
};

type NexonFirearmAtk = {
	level: number;
	firearm: {
		firearm_atk_type: string;
		firearm_atk_value: number;
	}[];
};

export type NexonReactor = {
	reactor_id: string;
	reactor_name: string;
	image_url: string;
	reactor_tier: string;
	reactor_skill_power: NexonReactorSkillPower[];
	optimized_condition_type: string;
};

export type NexonReactorSkillPower = {
	level: number;
	skill_atk_power: number;
	sub_skill_atk_power: number;
	skill_power_coefficient: NexonSkillPowerCoefficient[];
	enchant_effect: NexonEnchantEffect[];
};

type NexonSkillPowerCoefficient = {
	coefficient_stat_id: string;
	coefficient_stat_value: number;
};

export type NexonEnchantEffect = {
	enchant_level: number;
	stat_type: string;
	value: number;
};

export type NexonExternalComponent = {
	external_component_id: string;
	external_component_name: string;
	image_url: string;
	external_component_equipment_type: string;
	external_component_tier: string;
	base_stat: NexonBaseStat[];
	set_option_detail: NexonSetOptionDetail[];
};

type NexonBaseStat = {
	level: number;
	stat_id: string;
	stat_value: number;
};

type NexonSetOptionDetail = {
	set_option: string;
	set_count: number;
	set_option_effect: string;
};

export type NexonStat = {
	stat_id: string;
	stat_name: string;
};

export type NexonModule = {
	module_name: string;
	module_id: string;
	image_url: string;
	module_type: string;
	module_tier: string;
	module_socket_type: string;
	module_class: string;
	module_stat: NexonModuleStat[];
};

type NexonModuleStat = {
	level: number;
	module_capacity: number;
	value: string;
};

export type NexonDescendantResponse = NexonDescendant[];
export type NexonWeaponResponse = NexonWeapon[];
export type NexonReactorResponse = NexonReactor[];
export type NexonExternalComponentResponse = NexonExternalComponent[];
export type NexonStatResponse = NexonStat[];
export type NexonModuleResponse = NexonModule[];
