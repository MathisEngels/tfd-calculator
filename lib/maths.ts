import { Ammo, Attributes, AttributesValues, Effect, Enemy, EnemyFaction, PenetrationType, Reactor, Weapon } from "@/types";

export function getReactorSkillPower(reactor: Reactor, enemyFaction?: EnemyFaction) {
	let reactorSkillPower = 11060.963;

	if (reactor.lvl === 1) reactorSkillPower += 331.829;
	if (reactor.lvl === 2) reactorSkillPower += 663.658;

	if (enemyFaction) {
		for (const subStat of reactor.subStat) {
			if (subStat && subStat.name.toLowerCase().includes(enemyFaction)) {
				return (reactorSkillPower + subStat.value) * reactor.optimizationMultiplier;
			}
		}
	}

	return reactorSkillPower * reactor.optimizationMultiplier;
}

function getPowerRatio(effects: Effect[], effectName: string[]) {
	let powerRatio = 1;

	for (const effect of effects) {
		if (effectName.includes(effect.name)) {
			const isPercentage = effect.name.includes("Ratio");
			powerRatio += effect.value / (isPercentage ? 1 : 100);
		}
	}

	return powerRatio;
}

function getPowerModifier(effects: Effect[], effectName: string[]) {
	let powerModifier = 0;

	for (const effect of effects) {
		if (effectName.includes(effect.name)) {
			powerModifier += effect.value / 100;
		}
	}

	return powerModifier;
}

export function getSkillDamage(effects: Effect[], elementStr: string, archeStr: string, damagePercentage: number, reactor: Reactor, enemyType: EnemyFaction) {
	const element = elementStr.toLowerCase();
	const arche = archeStr.toLowerCase();

	const capitalizeElement = element.charAt(0).toUpperCase() + element.slice(1);
	const capitalizeArche = arche.charAt(0).toUpperCase() + arche.slice(1);

	const reactorSkillPower = getReactorSkillPower(reactor, enemyType);

	const skillPowerRatio = getPowerRatio(effects, ["Skill Power"]);

	const typePowerRatio =
		getPowerRatio(effects, [`${capitalizeElement} Skill Power`, `${capitalizeElement} Skill Power Boost Ratio`]) + (element === reactor.type ? 0.2 : 0);
	const archePowerRatio = getPowerRatio(effects, [`${capitalizeArche} Skill Power Boost Ratio`]) + (arche === reactor.arche ? 0.2 : 0);

	const powerModifier =
		damagePercentage / 100 +
		getPowerModifier(effects, ["Skill Power Modifier", `${capitalizeElement} Skill Power Modifier`, `${capitalizeArche} Skill Power Modifier`]);
	// `${type} Skill Power Modifier` exists in set effects

	const rawDamage = reactorSkillPower * skillPowerRatio * typePowerRatio * archePowerRatio * powerModifier;

	return { rawDamage, reactorSkillPower, skillPowerRatio, typePowerRatio, archePowerRatio, powerModifier };
}

function winningPenetrationType(weapon: Weapon, enemyPenetrationType: PenetrationType) {
	// Pierce > Crush > Burst > Pierce
	if (weapon.pierce && enemyPenetrationType === "crush") return true;
	if (weapon.crush && enemyPenetrationType === "burst") return true;
	if (weapon.burst && enemyPenetrationType === "pierce") return true;
	return false;
}

export function getWeaponDamage(weapon: Weapon, enemy: Enemy, effects: Effect[], enemyPenetrationType: PenetrationType) {
	let enemyType;
	if (enemy.name === "Immortality") {
		enemyType = "legion of immortality";
	} else if (enemy.name === "Truth") {
		enemyType = "order of truth";
	} else if (enemy.name === "Darkness") {
		enemyType = "legion of darkness";
	} else {
		enemyType = "colossus";
	}

	const firearmATKBonus = (effects.find((effect) => effect.name.toLowerCase() === "Firearm ATK".toLowerCase())?.value || 0) / 100;
	const factionATKBonus = effects.find((effect) => effect.name.toLowerCase() === `Bonus Firearm ATK (vs. ${enemyType})`.toLowerCase())?.value || 0;

	const applicablePhysicalBonus = (enemyType === "colossus" ? 0.1 : 0) + (winningPenetrationType(weapon, enemyPenetrationType) ? 0.1 : 0);

	const baseDamage = weapon.firearm_atk * (1 + firearmATKBonus);

	const physicalDamage = (baseDamage + factionATKBonus) * (1 + applicablePhysicalBonus) * calculateDR(enemy.resistance.def);

	const attributes: Exclude<Attributes, "Non-Attribute">[] = ["Fire", "Chill", "Electric", "Toxic"];

	const attributesValues: Record<Exclude<Attributes, "Non-Attribute">, AttributesValues> = {
		Fire: { flatAttributeSubStat: 0, conversionRate: 0, attributeATKBonus: 0, value: 0 },
		Chill: { flatAttributeSubStat: 0, conversionRate: 0, attributeATKBonus: 0, value: 0 },
		Electric: { flatAttributeSubStat: 0, conversionRate: 0, attributeATKBonus: 0, value: 0 },
		Toxic: { flatAttributeSubStat: 0, conversionRate: 0, attributeATKBonus: 0, value: 0 },
	};

	for (const attribute of attributes) {
		const flatAttributeSubStat = weapon.subStats.find((subStat) => subStat?.name.toLowerCase() === `${attribute} ATK`.toLowerCase())?.value || 0;
		const conversionRate = (effects.find((effect) => effect.name.toLowerCase() === `Convert to ${attribute} ATK`.toLowerCase())?.value || 0) / 100;
		const attributeATKBonus = (effects.find((effect) => effect.name.toLowerCase() === `${attribute} ATK`.toLowerCase())?.value || 0) / 100;

		attributesValues[attribute].flatAttributeSubStat = flatAttributeSubStat;
		attributesValues[attribute].conversionRate = conversionRate;
		attributesValues[attribute].attributeATKBonus = attributeATKBonus;
		attributesValues[attribute].value =
			(flatAttributeSubStat + baseDamage * conversionRate) *
			(1 + attributeATKBonus) *
			calculateDR(enemy.resistance[attribute.toLowerCase() as "fire" | "chill" | "electric" | "toxic"]);
	}

	return { baseDamage, physicalDamage, attributesValues, firearmATKBonus, factionATKBonus, applicablePhysicalBonus };
}

export function skillBasedFireRate(baseRate: number, fireRateEffect: number, skillDuration: number, ammoType: Ammo, isSharpPrecision?: boolean) {
	const modifiedRate = baseRate * (1 - fireRateEffect / 100);

	if (!isSharpPrecision) {
		const floatCount = skillDuration / modifiedRate;

		return { shotCount: 1 + Math.floor(floatCount), excessTime: floatCount - Math.floor(floatCount) };
	}

	const reductionPerStack = baseRate * 0.04;
	const maxStacks = 10;
	const sharpPrecisionAmmoTypeMap = {
		"General Rounds": 0.5,
		"Special Rounds": 0.5,
		"Impact Rounds": 0.4,
		"High-Power Rounds": 0,
	};

	const stackDelay = sharpPrecisionAmmoTypeMap[ammoType];

	let t = 0;
	let shotCount = 0;
	let remainingTime = 0;

	while (t < skillDuration) {
		const stacks = Math.min(Math.floor(t / stackDelay), maxStacks);
		const currentRate = modifiedRate - stacks * reductionPerStack;
		const nextT = t + currentRate;

		if (nextT <= skillDuration) {
			shotCount++;
			t = nextT;
		} else {
			remainingTime = skillDuration - t;
			break;
		}
	}

	return { shotCount, excessTime: remainingTime > 0 ? remainingTime : 0 };
}

export function calculateDR(resistance: number) {
	return 1 - Math.round((1 - 150 / (150 + Math.sqrt(resistance))) * 10000) / 10000;
}
