import TickDamageNoHooks from "@/components/calculator/TickDamageNoHooks";
import { useBuildStore } from "@/providers/BuildStoreProvider";

export default function TickDamage(duration: number, interval: number, element: string, arche: string, damagePrct: number, label: string = "Tick") {
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

	return TickDamageNoHooks(descendantEffects, reactor, enemy, duration, interval, element, arche, damagePrct, critDamage, critRate, label);
}
