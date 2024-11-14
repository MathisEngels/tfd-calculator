import { calculateDR, getSkillDamage } from "@/lib/maths";
import { Attributes, Effect, Enemy, EnemyFaction, Reactor, ResistanceType } from "@/types";
import Formula from "./Formula";
import FormulaContainer from "./FormulaContainer";

export default function HitDamageNoHooks(
	descendantEffects: Effect[],
	reactor: Reactor,
	enemy: Enemy,
	element: Attributes,
	arche: string,
	damagePrct: number,
	critDamage: number,
	critRate: number,
	label: string = "Hit",
) {
	const enemyFaction = (
		enemy.name === "Legion of Immortality" || enemy.name === "Order of Truth" || enemy.name === "Legion of Darkness" ? enemy.name.toLowerCase() : "colossus"
	) as EnemyFaction;

	const { rawDamage, reactorSkillPower, skillPowerRatio, typePowerRatio, archePowerRatio, powerModifier } = getSkillDamage(
		descendantEffects,
		element,
		arche,
		damagePrct,
		reactor,
		enemyFaction,
	);

	const elementFormated = element === "Non-Attribute" ? ("nonA" as ResistanceType) : (element.toLowerCase() as ResistanceType);
	const DR = calculateDR(enemy.resistance[elementFormated]);

	const damage = rawDamage * DR;
	const damageCrit = damage * critDamage;
	const critComposite = 1 + critRate * (critDamage - 1);
	const averageDamage = damage * critComposite;

	const component = (
		<FormulaContainer title={label} damage={averageDamage}>
			<Formula
				label=""
				leftValues={[
					{ label: "Reactor Skill Power", value: reactorSkillPower },
					{ label: "Skill Power Ratio", value: skillPowerRatio },
					{ label: `${element} Power Ratio`, value: typePowerRatio },
					{ label: `${arche} Power Ratio`, value: archePowerRatio },
					{ label: "Power Modifier", value: powerModifier },
				]}
				rightValue={{ label: "Raw Damage", value: rawDamage }}
				symbols={["x"]}
				green
				large
			/>
			<Formula
				label="Real Damage"
				leftValues={[
					{ label: "Raw Damage", value: rawDamage },
					{ label: "Enemy Resistance", value: DR },
				]}
				rightValue={{ label: "Real Damage", value: damage }}
				symbols={["x"]}
				green
				large
			/>
			<Formula
				label="Crit Damage"
				leftValues={[
					{ label: "Real Damage", value: damage },
					{ label: "Skill Critical Hit Damage", value: critDamage },
				]}
				rightValue={{ label: "Crit Damage", value: damageCrit }}
				symbols={["x"]}
				green
				large
			/>
			<Formula
				label="Average Damage"
				leftValues={[
					{ label: "Crit Composite", value: critComposite },
					{ label: "Damage", value: damage },
				]}
				rightValue={{ label: "Average Damage", value: averageDamage }}
				symbols={["x"]}
				green
				large
			/>
		</FormulaContainer>
	);

	return { averageDamage, component };
}
