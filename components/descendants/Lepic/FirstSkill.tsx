import DescendantCalculator from "@/components/DescendantCalculator";
import Formula from "@/components/calculator/Formula";
import FormulaContainer from "@/components/calculator/FormulaContainer";
import HitDamage from "@/components/calculator/HitDamage";
import { LepicSkill } from "@/components/descendants/Lepic";
import Burning from "@/components/descendants/Lepic/Burning";
import { Accordion } from "@/components/ui/accordion";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Attributes } from "@/types";

export default function FirstSkill({ skill, isBurningActive, burningSkill }: LepicSkill) {
	if (skill.skill_name === "Explosive Stacks") {
		return <ExplosiveStacks skill={skill} isBurningActive={isBurningActive} burningSkill={burningSkill} />;
	} else {
		return <GrenadeThrow skill={skill} isBurningActive={isBurningActive} burningSkill={burningSkill} />;
	}
}

function GrenadeThrow({ skill, isBurningActive, burningSkill }: LepicSkill) {
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const reactor = useBuildStore((state) => state.reactor);
	const enemy = useBuildStore((state) => state.against.enemy);
	const descendant = useBuildStore((state) => state.descendant)!;

	const addDmg = isBurningActive ? [Burning(descendantEffects, reactor, enemy, descendant, burningSkill!)] : [];

	return <DescendantCalculator.Skill skill={skill} additionalDamage={addDmg} />;
}

function ExplosiveStacks({ skill, isBurningActive, burningSkill }: LepicSkill) {
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const reactor = useBuildStore((state) => state.reactor);
	const enemy = useBuildStore((state) => state.against.enemy);
	const descendant = useBuildStore((state) => state.descendant)!;

	const burning = isBurningActive ? Burning(descendantEffects, reactor, enemy, descendant, burningSkill!) : null;

	const singleHit = HitDamage(skill.element_type as Attributes, skill.arche_type!, skill.damage_percentage!, "Single Hit");

	return (
		<DescendantCalculator.Skill skill={skill} hideDamage hideSum>
			{burning && (
				<Formula
					label="Sum of Average Damage"
					leftValues={[
						{ label: "3 Hits Damage", value: singleHit.averageDamage * 3 },
						{ label: "Burning", value: burning.averageDamage },
					]}
					rightValue={{ label: "Sum of Average Damage", value: singleHit.averageDamage * 3 + burning.averageDamage }}
					symbols={["+"]}
					green
					large
				/>
			)}
			<Accordion type="multiple" className="flex flex-col gap-2" defaultValue={["Burning", "3 Hits Damage", "Single Hit"]}>
				{burning && burning.component}
				<FormulaContainer title="3 Hits Damage" damage={singleHit.averageDamage * 3}>
					<Formula
						label="3 Hits Damage"
						leftValues={[
							{ label: "Single Hit Damage", value: singleHit.averageDamage },
							{ label: "Grenade throws", value: 3 },
						]}
						rightValue={{ label: "3 Hits Damage", value: singleHit.averageDamage * 3 }}
						symbols={["x"]}
						green
						large
					/>
				</FormulaContainer>
				{singleHit.component}
			</Accordion>
		</DescendantCalculator.Skill>
	);
}
