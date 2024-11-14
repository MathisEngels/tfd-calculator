import DescendantCalculator from "@/components/DescendantCalculator";
import { LepicSkill } from "@/components/descendants/Lepic";
import Burning from "@/components/descendants/Lepic/Burning";
import IsActive from "@/components/descendants/Lepic/IsActive";
import { useBuildStore } from "@/providers/BuildStoreProvider";

export default function SecondSkill({ skill, isBurningActive, setIsSecondSkillActive }: LepicSkill) {
	if (skill.skill_name === "Nerve Infiltration") {
		return <NerveInfiltration skill={skill} isBurningActive={isBurningActive} setIsSecondSkillActive={setIsSecondSkillActive} />;
	} else if (skill.skill_name === "Power Unit Change") {
		return <PowerUnitChange skill={skill} isBurningActive={isBurningActive} setIsSecondSkillActive={setIsSecondSkillActive} />;
	} else {
		return <Overclock skill={skill} isBurningActive={isBurningActive} setIsSecondSkillActive={setIsSecondSkillActive} />;
	}
}

function Overclock({ skill, isBurningActive, setIsSecondSkillActive }: LepicSkill) {
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const reactor = useBuildStore((state) => state.reactor);
	const enemy = useBuildStore((state) => state.against.enemy);
	const descendant = useBuildStore((state) => state.descendant)!;

	const addDmg = isBurningActive ? [Burning(descendantEffects, reactor, enemy, descendant, skill)] : [];

	return (
		<DescendantCalculator.Skill skill={skill} hideEnemySelector={!isBurningActive} hideEffects={!isBurningActive} additionalDamage={addDmg}>
			<IsActive label="Overclock" isActive={isBurningActive!} setIsActive={setIsSecondSkillActive!} />
		</DescendantCalculator.Skill>
	);
}

function NerveInfiltration({ skill, isBurningActive, setIsSecondSkillActive }: LepicSkill) {
	return (
		<DescendantCalculator.Skill skill={skill} hideEnemySelector={!isBurningActive} hideEffects={!isBurningActive}>
			<IsActive label="Overclock" isActive={isBurningActive!} setIsActive={setIsSecondSkillActive!} />
			<div className="flex flex-col gap-1 items-center justify-center">
				<p className="font-semibold">Weaken Regeneration (to Enemy hit by Grenade or Overkill).</p>
				<p className="font-light">Duration: 10s</p>
				<div className="bg-tfd-accent rounded-md p-2 flex flex-col items-center gap-2 text-center">
					<p>HP Recovery Out of Combat Status -50%</p>
					<p>Shield Recovery - Out of Combat -50%</p>
					<p>HP Recovery Battle Status -50%</p>
					<p>Shield Recovery - During Battle -50%</p>
					<p>HP Heal Recovery Modifier -50%</p>
					<p>Outgoing Shield Recovery Modifier -50%</p>
				</div>
			</div>
		</DescendantCalculator.Skill>
	);
}

function PowerUnitChange({ skill, isBurningActive, setIsSecondSkillActive }: LepicSkill) {
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const reactor = useBuildStore((state) => state.reactor);
	const enemy = useBuildStore((state) => state.against.enemy);
	const descendant = useBuildStore((state) => state.descendant)!;

	const addDmg = isBurningActive ? [Burning(descendantEffects, reactor, enemy, descendant, skill)] : [];

	return (
		<DescendantCalculator.Skill skill={skill} hideEnemySelector={!isBurningActive} hideEffects={!isBurningActive} additionalDamage={addDmg}>
			<IsActive label="Power Unit Change" isActive={isBurningActive!} setIsActive={setIsSecondSkillActive!} />
		</DescendantCalculator.Skill>
	);
}
