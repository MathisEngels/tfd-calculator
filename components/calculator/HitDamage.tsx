import HitDamageNoHooks from "@/components/calculator/HitDamageNoHooks";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Attributes } from "@/types";

export default function HitDamage(element: Attributes, arche: string, damagePrct: number, label: string = "Hit") {
	const descendant = useBuildStore((state) => state.descendant)!;
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const reactor = useBuildStore((state) => state.reactor);
	const enemy = useBuildStore((state) => state.against.enemy);

	let critDamage = descendant.crit_damage;
	let critRate = descendant.crit_rate;

	const skillCritDamage = descendantEffects.find((effect) => effect.name === "Skill Critical Hit Damage");
	const skillCritRate = descendantEffects.find((effect) => effect.name === "Skill Critical Hit Rate");

	if (skillCritDamage) critDamage *= 1 + skillCritDamage.value / 100;
	if (skillCritRate) critRate *= 1 + skillCritRate.value / 100;

	return HitDamageNoHooks(descendantEffects, reactor, enemy, element, arche, damagePrct, critDamage, critRate, label);
}
