import { Accordion } from "@/components/ui/accordion";
import { Attributes, DescendantSkill } from "@/types";
import React, { Fragment } from "react";
import Formula from "./Formula";
import HitDamage from "./HitDamage";
import TickDamage from "./TickDamage";

interface Props {
	skill: DescendantSkill;
	additionalDamage?: {
		averageDamage: number;
		component: React.JSX.Element;
		label: string;
	}[];
	hideSum?: boolean;
	hitLabel?: string;
	tickLabel?: string;
}

export default function Damage({ skill, additionalDamage, hideSum, hitLabel, tickLabel }: Props) {
	if (!skill.damage_percentage && !skill.tick_damage_percentage && (!additionalDamage || additionalDamage.length === 0)) {
		return <p className="text-center">This skill doesn&apos;t do any damage.</p>;
	}

	const hitDamage = skill.damage_percentage ? HitDamage(skill.element_type as Attributes, skill.arche_type!, skill.damage_percentage) : null;
	const tickDamage = skill.tick_damage_percentage
		? TickDamage(skill.tick_duration!, skill.tick_interval!, skill.element_type, skill.arche_type!, skill.tick_damage_percentage)
		: null;

	const damagesValues = [];
	const totalAverageDamage =
		(hitDamage?.averageDamage || 0) + (tickDamage?.averageDamage || 0) + (additionalDamage?.reduce((acc, curr) => acc + curr.averageDamage, 0) || 0);

	if (additionalDamage) {
		additionalDamage.forEach((damage) => {
			if (!damage) {
				return;
			}
			const { averageDamage, label } = damage;
			damagesValues.push({ label, value: averageDamage });
		});
	}
	if (hitDamage) damagesValues.push({ label: "Hit Damage", value: hitDamage.averageDamage });
	if (tickDamage) damagesValues.push({ label: "Tick Damage", value: tickDamage.averageDamage });

	return (
		<>
			{!hideSum && damagesValues.length > 1 && (
				<Formula
					className="mt-2"
					label="Sum of Average Damage"
					leftValues={damagesValues}
					rightValue={{ label: "Sum of Average Damage", value: totalAverageDamage }}
					symbols={["+"]}
					green
					large
				/>
			)}
			<Accordion
				className="flex flex-col gap-2"
				type="multiple"
				defaultValue={[hitLabel ?? "Hit", tickLabel ?? "Tick", ...(additionalDamage?.map((dmg) => dmg.label) || [])]}
			>
				{additionalDamage?.map((damage) => (
					<Fragment key={damage.label}>{damage.component}</Fragment>
				))}
				{hitDamage?.component}
				{tickDamage?.component}
			</Accordion>
		</>
	);
}
