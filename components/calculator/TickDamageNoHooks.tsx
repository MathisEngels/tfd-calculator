import { calculateDR, getSkillDamage } from "@/lib/maths";
import { Effect, Enemy, EnemyFaction, Reactor, ResistanceType } from "@/types";
import Formula from "./Formula";
import FormulaContainer from "./FormulaContainer";

export default function TickDamageNoHooks(
	descendantEffects: Effect[],
	reactor: Reactor,
	enemy: Enemy,
	duration: number,
	interval: number,
	element: string,
	arche: string,
	damagePrct: number,
	critDamage: number,
	critRate: number,
	label: string = "Tick",
) {
	const enemyFaction = (
		enemy.name === "Legion of Immortality" || enemy.name === "Order of Truth" || enemy.name === "Legion of Darkness" ? enemy.name.toLowerCase() : "colossus"
	) as EnemyFaction;

	const ticks = duration / interval;
	const { rawDamage } = getSkillDamage(descendantEffects, element, arche, damagePrct, reactor, enemyFaction);

	const elementFormated = element === "Non-Attribute" ? ("nonA" as ResistanceType) : (element.toLowerCase() as ResistanceType);
	const DR = calculateDR(enemy.resistance[elementFormated]);

	const damage = rawDamage * DR;
	const damageCrit = damage * critDamage;
	const critComposite = 1 + critRate * (critDamage - 1);
	const averageDamage = damage * ticks * critComposite;

	const component = (
		<FormulaContainer title={label} damage={averageDamage}>
			<Formula
				label="Total Ticks"
				leftValues={[
					{ label: "Duration", value: duration },
					{ label: "Interval", value: interval },
				]}
				rightValue={{ label: "Total Ticks", value: ticks }}
				symbols={["/"]}
				green
			/>
			<Formula
				label="Tick Damage"
				leftValues={[
					{ label: "Raw Damage", value: rawDamage },
					{ label: "Enemy Resistance", value: DR },
				]}
				rightValue={{ label: "Tick Damage", value: damage }}
				symbols={["x"]}
				green
				large
			/>
			<Formula
				label="Tick Crit Damage"
				leftValues={[
					{ label: "Tick Damage", value: damage },
					{ label: "Crit Damage", value: critDamage },
				]}
				rightValue={{ label: "Crit Damage", value: damageCrit }}
				symbols={["x"]}
				green
				large
			/>
			<Formula
				label="Sum of Tick Average Damage"
				leftValues={[
					{ label: "Crit Composite", value: critComposite },
					{ label: "Total Ticks", value: ticks },
					{ label: "Damage", value: damage },
				]}
				rightValue={{ label: "Sum of Tick Average Damage", value: averageDamage }}
				symbols={["x"]}
				green
				large
			/>
		</FormulaContainer>
	);
	return { averageDamage, component, label };
}
