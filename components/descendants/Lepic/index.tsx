import { getModules } from "@/app/api";
import DescendantCalculator from "@/components/DescendantCalculator";
import FirstSkill from "@/components/descendants/Lepic/FirstSkill";
import FourthSkill from "@/components/descendants/Lepic/FourthSkill";
import PassiveAbility from "@/components/descendants/Lepic/PassiveSkill";
import SecondSkill from "@/components/descendants/Lepic/SecondSkill";
import TractionGrenade from "@/components/descendants/Lepic/TractionGrenade";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { DescendantSkill, Skill } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type LepicSkill = Skill & {
	isBurningActive?: boolean;
	setIsSecondSkillActive?: (value: boolean) => void;
	burningSkill?: DescendantSkill;
};

export default function UltimateLepic() {
	const [isSecondSkillActive, setIsSecondSkillActive] = useState<boolean>(true);

	const descendant = useBuildStore((state) => state.descendant)!;
	const descendantMods = useBuildStore((state) => state.module.descendant);
	const addSkillEffect = useBuildStore((state) => state.addSkillEffect);
	const removeSkillBuff = useBuildStore((state) => state.removeSkillBuff);

	const { data: modules } = useSuspenseQuery({ queryKey: ["modules"], queryFn: getModules });

	const firearmMasterSkill: DescendantSkill = {
		skill_name: "Firearm Master",
		skill_description: "When reloading weapon, gains Load Mastery. Upon chaning weapons, gains Change Mastery.",
		skill_type: "Passive Skill",
		skill_image_url: modules.find((module) => module.module_name === "Firearm Master")!.image_url,
		element_type: "Fire",
	};
	const regenerativeBrakingSkill: DescendantSkill = {
		skill_name: "Regenerative Braking",
		skill_description: "When using a skill has a chance to recover MP. This effect gains cooldown.",
		skill_type: "Passive Skill",
		skill_image_url: modules.find((module) => module.module_name === "Regenerative Braking")!.image_url,
		element_type: "Fire",
	};
	const nerveInfiltrationSkill: DescendantSkill = {
		skill_name: "Nerve Infiltration",
		skill_description: "Gains Overclock. Inflicts Weaken Regeneration on enemies damaged by Grenade or Overkill.",
		skill_type: "Active Skill",
		reload: 20,
		MP_cost: 24,
		effects: [
			{
				label: "Skill Power Modifier",
				duration: 12,
				value: 30,
			},
		],
		skill_image_url: modules.find((module) => module.module_name === "Nerve Infiltration")!.image_url,
		element_type: "Fire",
		arche_type: "Singular",
	};
	const powerUnitChangeSkill: DescendantSkill = {
		skill_name: "Power Unit Change",
		skill_description: "Gains Power Unit Change. Inflicts Burn on enemies damaged by Grenade or Overkill.",
		skill_type: "Active Skill",
		reload: 20,
		MP_cost: 24,
		effects: [
			{
				label: "Firearm ATK",
				duration: 5,
				value: 52,
			},
			{
				label: "Explosive ATK",
				duration: 5,
				value: 52,
			},
		],
		skill_image_url: modules.find((module) => module.module_name === "Power Unit Change")!.image_url,
		element_type: "Fire",
		arche_type: "Singular",
		other_skill_tick_damage_percentage: 84.3,
		other_skill_tick_duration: 7,
		other_skill_tick_interval: 1,
	};
	const explosiveStacksSkill: DescendantSkill = {
		skill_name: "Explosive Stacks",
		skill_description:
			"Throws a Grenade in front to cause an explosion and deal Burst damage. Grenade is replenished every time a certain amount of bullets are used.",
		skill_type: "Active Skill",
		MP_cost: 20,
		skill_image_url: modules.find((module) => module.module_name === "Explosive Stacks")!.image_url,
		element_type: "Fire",
		arche_type: "Tech",
		damage_percentage: 290.4,
		range: 5,
		max_range_percentage: 200,
	};
	const increasedEfficiencySkill: DescendantSkill = {
		skill_name: "Increased Efficiency",
		skill_description:
			"Equip a Unique Weapon. Attacking with the Unique Weapon consumes MP, and is unequipped when MP is depleted. Enemies hit by Unique Weapon bullets take Burst DMG. Critical Hits have a chance to recover MP. MP Recovery has a cooldown.",
		skill_type: "Active Skill",
		skill_image_url: modules.find((module) => module.module_name === "Increased Efficiency")!.image_url,
		element_type: "Fire",
		arche_type: "Tech",
		damage_percentage: 370.9,
		MP_cost: 30,
		reload: 80,
		range: 5,
		max_range_percentage: 200,
	};

	const hasFirearmMaster = descendantMods[0]?.module_name === "Firearm Master";
	const hasRegenerativeBraking = descendantMods[0]?.module_name === "Regenerative Braking";
	const hasNerveInfiltration = descendantMods[0]?.module_name === "Nerve Infiltration";
	const hasPowerUnitChange = descendantMods[0]?.module_name === "Power Unit Change";
	const hasExplosiveStacks = descendantMods[0]?.module_name === "Explosive Stacks";
	const hasIncreasedEfficiency = descendantMods[0]?.module_name === "Increased Efficiency";

	useEffect(() => {
		if (isSecondSkillActive) {
			let skillPowerModifier = descendant.descendant_skill[1].effects![0].value;
			if (hasNerveInfiltration) skillPowerModifier = 30;

			addSkillEffect("Overclock", descendant.descendant_skill[1].effects![0].label, skillPowerModifier);
		} else {
			removeSkillBuff("Overclock");
		}
	}, [addSkillEffect, descendant.descendant_skill, hasNerveInfiltration, isSecondSkillActive, removeSkillBuff]);

	const skills = [...descendant.descendant_skill];
	if (hasFirearmMaster) {
		skills[4] = firearmMasterSkill;
	} else if (hasRegenerativeBraking) {
		skills[4] = regenerativeBrakingSkill;
	} else if (hasNerveInfiltration) {
		skills[1] = nerveInfiltrationSkill;
	} else if (hasPowerUnitChange) {
		skills[1] = powerUnitChangeSkill;
	} else if (hasExplosiveStacks) {
		skills[0] = explosiveStacksSkill;
	} else if (hasIncreasedEfficiency) {
		skills[3] = increasedEfficiencySkill;
	}

	return (
		<DescendantCalculator skills={skills}>
			<FirstSkill skill={skills[0]} isBurningActive={isSecondSkillActive && !hasNerveInfiltration} burningSkill={skills[1]} />
			<SecondSkill skill={skills[1]} isBurningActive={isSecondSkillActive} setIsSecondSkillActive={setIsSecondSkillActive} />
			<TractionGrenade skill={skills[2]} />
			<FourthSkill skill={skills[3]} isBurningActive={isSecondSkillActive && !hasNerveInfiltration} burningSkill={skills[1]} />
			<PassiveAbility skill={skills[4]} />
		</DescendantCalculator>
	);
}
