import DescendantCalculator from "@/components/DescendantCalculator";
import Effect from "@/components/calculator/Effect";
import EffectContainer from "@/components/calculator/EffectContainer";
import { LepicSkill } from "@/components/descendants/Lepic";
import IsActive from "@/components/descendants/Lepic/IsActive";
import { getNumberFormatter } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { useEffect, useState } from "react";

export default function PassiveAbility({ skill }: LepicSkill) {
	if (skill.skill_name === "Firearm Master") {
		return <FirearmMaster skill={skill} />;
	} else if (skill.skill_name === "Regenerative Braking") {
		return <RegenerativeBraking skill={skill} />;
	} else {
		return <CloseCall />;
	}
}

function FirearmMaster({ skill }: LepicSkill) {
	const [loadMasteryActive, setLoadMasteryActive] = useState(true);
	const [changeMasteryActive, setChangeMasteryActive] = useState(true);

	const addSkillEffect = useBuildStore((state) => state.addSkillEffect);
	const removeSkillBuff = useBuildStore((state) => state.removeSkillBuff);

	useEffect(() => {
		if (loadMasteryActive) {
			addSkillEffect("Load Mastery", "Skill Range", 45);
		} else {
			removeSkillBuff("Load Mastery");
		}
	}, [addSkillEffect, loadMasteryActive, removeSkillBuff]);

	useEffect(() => {
		if (changeMasteryActive) {
			addSkillEffect("Change Mastery", "Skill Power Modifier", 39);
		} else {
			removeSkillBuff("Change Mastery");
		}
	}, [addSkillEffect, changeMasteryActive, removeSkillBuff]);

	return (
		<DescendantCalculator.Skill skill={skill} hideEnemySelector>
			<div className="flex flex-col gap-2 items-center">
				<IsActive label="Load Mastery" isActive={loadMasteryActive} setIsActive={setLoadMasteryActive} />
				<IsActive label="Change Mastery" isActive={changeMasteryActive} setIsActive={setChangeMasteryActive} />
			</div>
			<EffectContainer>
				<Effect title="Load Mastery" label="Skill Range" value={45} duration={5} />
				<Effect title="Change Mastery" label="Skill Power Modifier" value={39} duration={5} />
			</EffectContainer>
		</DescendantCalculator.Skill>
	);
}

function RegenerativeBraking({ skill }: LepicSkill) {
	const descendant = useBuildStore((state) => state.descendant)!;
	const descendantStats = useBuildStore((state) => state.descendantStats);
	const descendantEffects = useBuildStore((state) => state.descendantEffects);

	const defaultMaxMP = Number(descendant.descendant_stat.find((stat) => stat.stat_type === "Max MP")!.stat_value);
	const additiveMaxMP = descendantStats.find((stat) => stat.name === "Max MP")?.value || 0;
	const multiplierMaxMP = descendantEffects.find((effect) => effect.name === "Max MP")?.value || 0;
	const maxMP = (defaultMaxMP + additiveMaxMP) * (1 + multiplierMaxMP / 100);

	return (
		<DescendantCalculator.Skill skill={skill} hideEnemySelector>
			<EffectContainer>
				<Effect title="Regenerative Braking">
					<p>
						When using a skill, has a 17% chance to recover <span className="font-semibold text-green-500">{getNumberFormatter().format(maxMP * 0.12)}</span>{" "}
						MP. 10s CD.
					</p>
				</Effect>
			</EffectContainer>
		</DescendantCalculator.Skill>
	);
}

function CloseCall() {
	const descendant = useBuildStore((state) => state.descendant)!;
	const descendantStats = useBuildStore((state) => state.descendantStats);
	const descendantEffects = useBuildStore((state) => state.descendantEffects);

	const defaultMaxHP = Number(descendant.descendant_stat.find((stat) => stat.stat_type === "Max HP")!.stat_value);
	const additiveMaxHP = descendantStats.find((stat) => stat.name === "Max HP")?.value || 0;
	const multiplierMaxHP = descendantEffects.find((effect) => effect.name === "Max HP")?.value || 0;

	const maxHP = (defaultMaxHP + additiveMaxHP) * (1 + multiplierMaxHP / 100);

	return (
		<DescendantCalculator.Skill skill={descendant.descendant_skill[4]} hideEnemySelector>
			<EffectContainer>
				<Effect title="Close Call">
					<p>
						Grants DMG Immunity and Immobilization for <span className="font-semibold">5,00</span>s. Recovers{" "}
						<span className="font-semibold text-green-500">{getNumberFormatter().format(maxHP * 0.5)}</span> HP when Close Call expires.
					</p>
				</Effect>
			</EffectContainer>
		</DescendantCalculator.Skill>
	);
}
