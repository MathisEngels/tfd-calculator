import DescendantCalculator from "@/components/DescendantCalculator";
import Formula from "@/components/calculator/Formula";
import FormulaContainer from "@/components/calculator/FormulaContainer";
import HitDamage from "@/components/calculator/HitDamage";
import TickDamage from "@/components/calculator/TickDamage";
import ValueLabel from "@/components/calculator/ValueLabel";
import { LepicSkill } from "@/components/descendants/Lepic";
import Burning from "@/components/descendants/Lepic/Burning";
import { Accordion } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { skillBasedFireRate } from "@/lib/maths";
import { getNumberFormatter } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Attributes } from "@/types";
import { useState } from "react";

export default function FourthSkill({ skill, isBurningActive, burningSkill }: LepicSkill) {
	if (skill.skill_name === "Increased Efficiency") {
		return <IncreasedEfficiency skill={skill} isBurningActive={isBurningActive} burningSkill={burningSkill} />;
	} else {
		return <Overkill skill={skill} isBurningActive={isBurningActive} burningSkill={burningSkill} />;
	}
}

function Overkill({ skill, isBurningActive, burningSkill }: LepicSkill) {
	const descendantStats = useBuildStore((state) => state.descendantStats);
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const weaponEffects = useBuildStore((state) => state.weaponEffects);
	const descendant = useBuildStore((state) => state.descendant)!;
	const reactor = useBuildStore((state) => state.reactor);
	const enemy = useBuildStore((state) => state.against.enemy);
	const modules = useBuildStore((state) => state.module);
	const weapon = useBuildStore((state) => state.weapon);

	const [isSharpPrecision, setIsSharpPrecision] = useState(!!modules.weapon.find((module) => module && module.module_name.includes("Sharp Precision Shot")));

	if (!weapon) return <NoWeaponSelected skill={skill} />;

	const addDmg = isBurningActive ? [Burning(descendantEffects, reactor, enemy, descendant, burningSkill!)] : [];

	let duration = skill.duration!;
	let tickDuration = skill.tick_duration!;

	const skillCost = descendantEffects.find((effect) => effect.name === "Skill Cost");
	const skillDurationEffect = descendantEffects.find((effect) => effect.name === "Skill Duration");
	let fireRateEffect = weaponEffects.find((effect) => effect.name === "Fire Rate")?.value || 0;
	if (modules.weapon.find((module) => module && module.module_name.includes("Sharp Precision Shot"))) fireRateEffect += 20; // Negate the fire rate reduction from SPS module.

	if (skillDurationEffect) {
		duration *= 1 - skillDurationEffect.value / 100;
		tickDuration *= 1 - skillDurationEffect.value / 100;
	}

	const defaultMaxMP = Number(descendant.descendant_stat.find((stat) => stat.stat_type === "Max MP")!.stat_value);
	const additiveMaxMP = descendantStats.find((stat) => stat.name === "Max MP")?.value || 0;
	const multiplierMaxMP = descendantEffects.find((effect) => effect.name === "Max MP")?.value || 0;

	const maxMP = (defaultMaxMP + additiveMaxMP) * (1 + multiplierMaxMP / 100);
	const remainingMP = maxMP - skill.MP_cost! * (1 - (skillCost?.value || 0) / 100);

	const continuousCost = skill.tick_MP_cost! * (1 - (skillCost?.value || 0) / 100);
	const allowedMPDuration = Math.ceil(remainingMP / continuousCost);

	const rollDuration = 1.06;
	const usableDuration = duration - rollDuration;
	const baseRate = 60 / 46;

	const usableDurationFireRate = skillBasedFireRate(baseRate, fireRateEffect, usableDuration, weapon.weapon_rounds_type, isSharpPrecision);
	const allowedMPDurationFireRate = skillBasedFireRate(baseRate, fireRateEffect, allowedMPDuration, weapon.weapon_rounds_type, isSharpPrecision);

	const highestFireRate = usableDurationFireRate.shotCount > allowedMPDurationFireRate.shotCount ? usableDurationFireRate : allowedMPDurationFireRate;

	const hitDamage = HitDamage(skill.element_type as Attributes, skill.arche_type!, skill.damage_percentage!, "Single Hit");
	const tickDamage = TickDamage(tickDuration, skill.tick_interval!, skill.element_type, skill.arche_type!, skill.tick_damage_percentage!, "Single Tick");

	const tickPerHit = Math.floor(tickDuration / skill.tick_interval!);
	const totalTicks = highestFireRate.shotCount * tickPerHit;

	const totalHitDamage = hitDamage.averageDamage * highestFireRate.shotCount;
	const totalTickDamage = tickDamage.averageDamage * totalTicks;
	const totalDamage = totalHitDamage + totalTickDamage;

	const finalDamage = addDmg[0] ? totalDamage + addDmg[0].averageDamage * highestFireRate.shotCount : totalDamage;

	return (
		<DescendantCalculator.Skill skill={skill} hideDamage>
			<div>
				<div className="flex flex-col gap-2 items-center">
					<div className="flex gap-2 items-center">
						<Label htmlFor="sharp-precision">Use Sharp Precision</Label>
						<Switch id="sharp-precision" checked={isSharpPrecision} onCheckedChange={(val) => setIsSharpPrecision(val)} />
					</div>
					<div className="flex gap-2">
						<ValueLabel label="Shot Count (Hit)" value={highestFireRate.shotCount} />
						<ValueLabel label="Excess Time" value={highestFireRate.excessTime} />
						<ValueLabel label="Total Ticks" value={totalTicks} />
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<ValueLabel
										label="Bottlenecked by"
										value={`${
											usableDurationFireRate.shotCount === allowedMPDurationFireRate.shotCount
												? "None"
												: usableDurationFireRate.shotCount > allowedMPDurationFireRate.shotCount
													? "Duration"
													: "MP"
										} (+${Math.abs(usableDurationFireRate.shotCount - allowedMPDurationFireRate.shotCount)} shot)`}
									/>
								</TooltipTrigger>
								<TooltipContent className="max-w-[10vw]">
									<p className="text-sm">
										If bottlenecked by MP, this means that if you had <span className="italic">infinite</span> MP, you could get the numbers of shots in
										parantheses. If bottlenecked by Duration, it's the other way around.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				{isBurningActive && (
					<Formula
						label="Sum of Average Damage"
						leftValues={[
							{ label: "Total Skill Damage", value: totalDamage },
							{ label: "Burning", value: addDmg[0].averageDamage },
							{ label: "Shot count", value: highestFireRate.shotCount },
						]}
						rightValue={{ label: "Total Damage", value: finalDamage }}
						symbols={["+", "x"]}
						green
						large
					/>
				)}
				<Accordion type="multiple" className="flex flex-col gap-2" defaultValue={["Total Skill Damage"]}>
					<FormulaContainer title="Total Skill Damage" damage={totalDamage}>
						<Formula
							label="Total Hit Damage"
							leftValues={[
								{ label: "Single Hit Damage", value: hitDamage.averageDamage },
								{ label: "Shot count", value: highestFireRate.shotCount },
							]}
							rightValue={{ label: "Total Hit Damage", value: totalHitDamage }}
							symbols={["x"]}
							green
						/>
						<Formula
							label="Total Tick Damage"
							leftValues={[
								{ label: "Single Tick Damage", value: tickDamage.averageDamage },
								{ label: "Total ticks", value: totalTicks },
							]}
							rightValue={{ label: "Total Tick Damage", value: totalTickDamage }}
							symbols={["x"]}
							green
						/>
						<Formula
							label="Total Damage"
							leftValues={[
								{ label: "Total Hit Damage", value: totalHitDamage },
								{ label: "Total Tick Damage", value: totalTickDamage },
							]}
							rightValue={{ label: "Total Damage", value: totalDamage }}
							symbols={["+"]}
							green
							large
						/>
					</FormulaContainer>
					{hitDamage.component}
					{tickDamage.component}
				</Accordion>
			</div>
		</DescendantCalculator.Skill>
	);
}

function IncreasedEfficiency({ skill, isBurningActive, burningSkill }: LepicSkill) {
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const descendantStats = useBuildStore((state) => state.descendantStats);
	const descendant = useBuildStore((state) => state.descendant)!;
	const reactor = useBuildStore((state) => state.reactor);
	const enemy = useBuildStore((state) => state.against.enemy);
	const weapon = useBuildStore((state) => state.weapon);

	if (!weapon) return <NoWeaponSelected skill={skill} />;

	const addDmg = isBurningActive ? [Burning(descendantEffects, reactor, enemy, descendant, burningSkill!)] : [];

	const defaultMaxMP = Number(descendant.descendant_stat.find((stat) => stat.stat_type === "Max MP")!.stat_value);
	const additiveMaxMP = descendantStats.find((stat) => stat.name === "Max MP")?.value || 0;
	const multiplierMaxMP = descendantEffects.find((effect) => effect.name === "Max MP")?.value || 0;

	const maxMP = (defaultMaxMP + additiveMaxMP) * (1 + multiplierMaxMP / 100);

	const skillCost = descendantEffects.find((effect) => effect.name === "Skill Cost");
	const skillCritRate = descendantEffects.find((effect) => effect.name === "Skill Critical Hit Rate");

	let mpCost = skill.MP_cost!;
	mpCost += ((skillCost?.value || 0) / 100) * mpCost;

	let critRate = descendant.crit_rate;
	if (skillCritRate) critRate *= 1 + skillCritRate.value / 100;

	const probTotal = critRate * 0.3;
	const avgMPGain = probTotal * (maxMP * 0.15);
	const netMPCost = mpCost - avgMPGain;
	const averageShotCount = Math.ceil(maxMP / netMPCost);

	const hitDamage = HitDamage(skill.element_type as Attributes, skill.arche_type!, skill.damage_percentage!, "Single Hit");

	const totalDamage = hitDamage.averageDamage * averageShotCount;

	const finalDamage = addDmg[0] ? totalDamage + addDmg[0].averageDamage * averageShotCount : totalDamage;

	return (
		<DescendantCalculator.Skill skill={skill} hideDamage>
			<div>
				<div className="flex flex-col gap-2 items-center">
					<div className="flex gap-2">
						<ValueLabel label="Average Shot Count (Hit)" value={averageShotCount} />
					</div>
				</div>
			</div>
			<div>
				<p className="text-center">
					Whenever you crit with the Unique Weapon, you have <span className="text-green-500 font-semibold">{getNumberFormatter().format(30)}</span>% chance to
					recover <span className="text-green-500 font-semibold">{getNumberFormatter().format(maxMP * 0.15)}</span> MP.
				</p>
			</div>
			<div className="flex flex-col gap-2">
				{isBurningActive && (
					<Formula
						label="Sum of Average Damage"
						leftValues={[
							{ label: "Total Skill Damage", value: totalDamage },
							{ label: "Burning", value: addDmg[0].averageDamage },
							{ label: "Average Shot count", value: averageShotCount },
						]}
						rightValue={{ label: "Total Damage", value: finalDamage }}
						symbols={["+", "x"]}
						green
						large
					/>
				)}
				<Accordion type="multiple" className="flex flex-col gap-2" defaultValue={["Total Skill Damage"]}>
					<FormulaContainer title="Total Skill Damage" damage={totalDamage}>
						<Formula
							label="Total Hit Damage"
							leftValues={[
								{ label: "Single Hit Damage", value: hitDamage.averageDamage },
								{ label: "Shot count", value: averageShotCount },
							]}
							rightValue={{ label: "Total Hit Damage", value: totalDamage }}
							symbols={["x"]}
							green
						/>
					</FormulaContainer>
					{hitDamage.component}
				</Accordion>
			</div>
		</DescendantCalculator.Skill>
	);
}

function NoWeaponSelected({ skill }: LepicSkill) {
	return (
		<DescendantCalculator.Skill skill={skill} hideDamage hideEnemySelector>
			<p className="text-center font-semibold">Select a weapon first</p>
		</DescendantCalculator.Skill>
	);
}
