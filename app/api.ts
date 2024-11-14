"use server";

import { promises as fs } from "fs";
import { effectParser } from "@/lib/utils";
import {
	EnemiesGroup,
	ExternalComponent,
	Module,
	ModuleSupplementData,
	NexonDescendantResponse,
	NexonExternalComponentResponse,
	NexonModuleResponse,
	NexonReactor,
	NexonStatResponse,
	NexonWeaponResponse,
	SupportedDescendant,
	Weapon,
	WeaponStat,
} from "@/types";

const fetchOptions = { next: { revalidate: 3600 } };

const nexonBaseAPI = "https://open.api.nexon.com/static/tfd/meta/en";

const dataPath = "./data";

const cacheMap = new Map<string, { data: unknown; timestamp: number }>();

function cache<T>(fn: () => T, key: string, duration = 86400000): () => T {
	const cached = cacheMap.get(key);

	if (cached && Date.now() - cached.timestamp < duration) {
		return () => cached.data as T;
	}

	const result = fn();
	cacheMap.set(key, { data: result, timestamp: Date.now() });

	return () => result;
}

export const getEffects = cache(async () => {
	const nexonStats = (await fetch(`${nexonBaseAPI}/stat.json`, fetchOptions).then((res) => res.json())) as NexonStatResponse;

	const effectList = nexonStats.map((stat) => {
		// Fixing some effect names
		if (stat.stat_name.includes("UP") || stat.stat_name.includes("DOWN")) {
			stat.stat_name = stat.stat_name.replace("UP", "").replace("DOWN", "").trim();
		}

		if (stat.stat_name === "Incoming Damage Modifier") stat.stat_name = "Incoming DMG Modifier";
		return stat.stat_name;
	});

	// Add some effects that are missing in the API
	effectList.push(
		"HP Heal",
		"Critical Hit Resistance",
		"MP Recovery",
		"Non-Attribute Skill Power",
		"Fire Skill Power",
		"Electric Skill Power",
		"Toxic Skill Power",
		"Chill Skill Power",
		"Tech Skill Power Modifier",
		"Fusion Skill Power Modifier",
		"Singular Skill Power Modifier",
		"Dimension Skill Power Modifier",
		"Movement Speed While Aiming",
		"Max General Rounds",
		"Accuracy",
		"Convert to Fire ATK",
		"Convert to Electric ATK",
		"Convert to Toxic ATK",
		"Convert to Chill ATK",
	);

	return effectList;
}, "getEffects");

export const getSupportedDescendants = cache(async () => {
	const file = await fs.readFile(`${dataPath}/descendants.json`, "utf-8");
	const supportedDescendant = JSON.parse(file) as SupportedDescendant[];

	const nexonDescendants = (await fetch(`${nexonBaseAPI}/descendant.json`, fetchOptions).then((res) => res.json())) as NexonDescendantResponse;

	const data = supportedDescendant.map((descendant) => {
		const { descendant_skill, descendant_stat, ...rest } = nexonDescendants.find((nexonDesc) => nexonDesc.descendant_name === descendant.name)!;

		const skills = descendant_skill.map((skill) => {
			const skillData = descendant.skills.find((descSkill) => descSkill.skill_name === skill.skill_name);

			return {
				...skill,
				...skillData,
			};
		});

		return {
			...rest,
			crit_damage: descendant.crit_damage,
			crit_rate: descendant.crit_rate,
			descendant_skill: skills,
			descendant_stat: descendant_stat[39].stat_detail,
		};
	});

	return data;
}, "getSupportedDescendants");

export const getReactorImageUrl = cache(async () => {
	const nexonReactors = (await fetch(`${nexonBaseAPI}/reactor.json`, fetchOptions).then((res) => res.json())) as NexonReactor[];

	const imageUrlByReactorName = nexonReactors.reduce(
		(acc, reactor) => {
			if (acc[reactor.reactor_name]) return acc;

			acc[reactor.reactor_name] = reactor.image_url;
			return acc;
		},
		{} as Record<string, string>,
	);

	return imageUrlByReactorName;
}, "getReactorImageUrl");

export const getModules = cache(async () => {
	const nexonModules = (await fetch(`${nexonBaseAPI}/module.json`, fetchOptions).then((res) => res.json())) as NexonModuleResponse;

	const effectList = await getEffects();

	const file = await fs.readFile(`${dataPath}/modules.json`, "utf-8");
	const moduleSupplementData = JSON.parse(file) as Record<string, ModuleSupplementData[]>;

	const data: Module[] = nexonModules.flatMap((module) => {
		const { module_stat, ...rest } = module;

		const lastLevelEffectStr = module_stat[module_stat.length - 1].value;
		const effects = effectParser(lastLevelEffectStr, effectList);
		const supplementData = moduleSupplementData[rest.module_id];

		if (supplementData !== undefined) {
			const modulesToAdd = [];

			for (let i = 0; i < supplementData.length; i++) {
				const supplementDataToAdd = supplementData[i];

				const name = supplementDataToAdd.namePattern ? supplementDataToAdd.namePattern.replace("{0}", rest.module_name) : rest.module_name;
				const explanation = supplementDataToAdd.effects ? supplementDataToAdd.explanation : module_stat[module_stat.length - 1].value;

				const modToAdd: Module = {
					...rest,
					module_id: `${rest.module_id}-${i}`,
					module_name: name,
					module_explanation: explanation,
					module_subclass: supplementDataToAdd.subClass,
					module_effects: supplementDataToAdd.effects || effects,
					supported: supplementDataToAdd.supported || false,
				};

				modulesToAdd.push(modToAdd);
			}

			return modulesToAdd;
		} else {
			return {
				...rest,
				module_defined: false,
				module_explanation: module_stat[module_stat.length - 1].value,
				module_effects: effects,
			};
		}
	});

	return data;
}, "getModules");

export const getExternalComponents = cache(async () => {
	const nexonExternalComponents = (await fetch(`${nexonBaseAPI}/external-component.json`, fetchOptions).then((res) =>
		res.json(),
	)) as NexonExternalComponentResponse;
	const nexonStats = (await fetch(`${nexonBaseAPI}/stat.json`, fetchOptions).then((res) => res.json())) as NexonStatResponse;

	const effectList = await getEffects();

	const data = nexonExternalComponents.map((component) => {
		const { base_stat, external_component_tier, set_option_detail, ...rest } = component;
		const setName = component.external_component_name.replace(component.external_component_equipment_type, "").trim();

		const setEffects = set_option_detail.map((set) => {
			return {
				effects: effectParser(set.set_option_effect, effectList),
			};
		});

		return {
			...rest,
			stat_value: base_stat[99].stat_value,
			stat_type: nexonStats.find((stat) => stat.stat_id === base_stat[99].stat_id)!.stat_name,
			set_name: setName,
			external_component_tier: external_component_tier.toLowerCase(),
			set_effects: setEffects,
		};
	});

	return data as ExternalComponent[];
}, "getExternalComponents");

export const getWeapons = cache(async () => {
	const nexonWeapons = (await fetch(`${nexonBaseAPI}/weapon.json`, fetchOptions).then((res) => res.json())) as NexonWeaponResponse;

	const data = nexonWeapons.map((weapon) => {
		const { base_stat, firearm_atk, ...rest } = weapon;

		const stats: WeaponStat = {};

		for (const baseStat of base_stat) {
			switch (baseStat.stat_id) {
				case "105000023":
					stats["fire_rate"] = baseStat.stat_value;
					break;
				case "105000035":
					stats["weak_point_damage"] = baseStat.stat_value;
					break;
				case "105000005":
					stats["max_range"] = baseStat.stat_value;
					break;
				case "105000021":
					stats["magazine_size"] = baseStat.stat_value;
					break;
				case "105000095":
					stats["reload_time"] = baseStat.stat_value;
					break;
				case "105000030":
					stats["critical_hit_rate"] = baseStat.stat_value;
					break;
				case "105000031":
					stats["critical_hit_damage"] = baseStat.stat_value;
					break;
				case "105000069":
					stats["burst"] = true;
					break;
				case "105000070":
					stats["crush"] = true;
					break;
				case "105000071":
					stats["pierce"] = true;
					break;
			}
		}

		return {
			...rest,
			...stats,
			firearm_atk: firearm_atk[99].firearm[0].firearm_atk_value,
			subStats: [],
		};
	});

	return data as Weapon[];
}, "getWeapons");

export const getEnemiesGroups = cache(async () => {
	const file = await fs.readFile(`${dataPath}/enemies.json`, "utf-8");
	const enemies = JSON.parse(file) as EnemiesGroup[];

	return enemies;
}, "getEnemiesGroups");
