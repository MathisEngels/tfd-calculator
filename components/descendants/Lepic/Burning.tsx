import TickDamageNoHooks from "@/components/calculator/TickDamageNoHooks";
import { Descendant, DescendantSkill, Effect, Enemy, Reactor } from "@/types";

export default function Burning(descendantEffects: Effect[], reactor: Reactor, enemy: Enemy, descendant: Descendant, skill: DescendantSkill) {
	let critDamage = descendant.crit_damage;
	let critRate = descendant.crit_rate;

	const skillCritDamage = descendantEffects.find((effect) => effect.name === "Skill Critical Hit Damage");
	const skillCritRate = descendantEffects.find((effect) => effect.name === "Skill Critical Hit Rate");

	if (skillCritDamage) critDamage *= 1 + skillCritDamage.value / 100;
	if (skillCritRate) critRate *= 1 + skillCritRate.value / 100;

	return TickDamageNoHooks(
		descendantEffects,
		reactor,
		enemy,
		skill.other_skill_tick_duration!,
		skill.other_skill_tick_interval!,
		skill.element_type,
		skill.arche_type!,
		skill.other_skill_tick_damage_percentage!,
		critDamage,
		critRate,
		"Burning",
	);
}
