import { Effect, ExternalComponents, Module, Reactor, Stat, Weapon } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

let numberFormatter: Intl.NumberFormat;

export function getNumberFormatter() {
	if (!numberFormatter) {
		numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });
	}
	return numberFormatter;
}

export function extractAll(
	modules: (Module | null)[],
	externalComponents: ExternalComponents,
	reactor: Reactor,
	skillEffects: { label: string; effect: Effect }[],
) {
	const effects: Effect[] = [];
	const stats: Stat[] = [];

	for (const mod of modules) {
		if (!mod) continue;

		for (const effect of mod.module_effects) {
			addOrCombine(effect.flat ? stats : effects, effect);
		}
	}

	const setsDict: { [key: string]: number } = {};

	for (const component of Object.values(externalComponents)) {
		setsDict[component.set_name] = (setsDict[component.set_name] || 0) + 1;

		addOrCombine(stats, { name: component.stat_type, value: component.stat_value });

		for (const subStat of component.subStat) {
			if (subStat) {
				addOrCombine(subStat.flat ? stats : effects, subStat);
			}
		}

		if (component.set_effects[0]) {
			if (setsDict[component.set_name] === 2) {
				for (const effect of component.set_effects[0].effects) {
					addOrCombine(effect.flat ? stats : effects, effect);
				}
			} else if (setsDict[component.set_name] === 4) {
				for (const effect of component.set_effects[1].effects) {
					addOrCombine(effect.flat ? stats : effects, effect);
				}
			}
		}
	}

	for (const subStat of reactor.subStat) {
		if (subStat) {
			addOrCombine(subStat.flat ? stats : effects, subStat);
		}
	}

	for (const skillEffect of skillEffects) {
		addOrCombine(effects, skillEffect.effect);
	}

	return { effects, stats };
}

export function extractForWeapon(weapon: Weapon, modules: (Module | null)[]) {
	const effects: Effect[] = [];

	const avoidSubStat = ["Fire ATK", "Electric ATK", "Toxic ATK", "Chill ATK"];
	for (const subStat of weapon.subStats) {
		if (subStat && !avoidSubStat.includes(subStat.name)) {
			addOrCombine(effects, subStat);
		}
	}

	for (const mod of modules) {
		if (!mod) continue;

		for (const effect of mod.module_effects) {
			addOrCombine(effects, effect);
		}
	}

	return effects;
}

function addOrCombine(arr: (Effect | Stat)[], item: Effect | Stat) {
	const newItem = { ...item };

	const existingItem = arr.find((e) => e.name === item.name);
	if (existingItem) {
		existingItem.value += newItem.value;
	} else {
		arr.push(newItem);
	}
}

export function valueColor(value: number, defaultValue: number, isHigherBetter?: boolean) {
	if (isHigherBetter) {
		return value > defaultValue ? "text-green-500" : value < defaultValue ? "text-red-500" : "";
	}
	return value > defaultValue ? "text-red-500" : value < defaultValue ? "text-green-500" : "";
}

export function effectParser(effectString: string, effectList: string[]) {
	const possibleEffects = effectString.split(/,|\n/);

	const effects: Effect[] = [];

	const sortedEffectList = effectList.sort((a, b) => b.length - a.length);

	for (let i = 0; i < possibleEffects.length; i++) {
		const possibleEffectStr = possibleEffects[i].trim();

		const specificStat = sortedEffectList.find((stat) => possibleEffectStr.startsWith(stat));

		if (specificStat) {
			const [_, rawValue] = possibleEffectStr.split(specificStat);
			if (!rawValue.includes("+") && !rawValue.includes("-")) continue;

			const flat = specificStat.includes("%");
			const value = parseFloat(rawValue);

			effects.push({
				name: specificStat,
				value,
				flat,
			});
			continue;
		}

		if (i === 0) break;
	}

	return effects;
}

export function checkIfInRange(value: number, min: number, max: number) {
	return value >= min && value <= max;
}
