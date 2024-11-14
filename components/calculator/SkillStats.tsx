import { getNumberFormatter, valueColor } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { DescendantSkill } from "@/types";
import clsx from "clsx";

interface Props {
	skill: DescendantSkill;
	isRadius?: boolean;
}

export default function SkillStats({ skill, isRadius }: Props) {
	const descendantEffects = useBuildStore((state) => state.descendantEffects);

	let reload = skill.reload;
	let mpCost = skill.MP_cost;
	let range = skill.range;
	let duration = skill.duration;

	if (reload) {
		const skillCD = descendantEffects.find((effect) => effect.name === "Skill Cooldown");

		reload += ((skillCD?.value || 0) / 100) * reload;
	}

	if (mpCost) {
		const skillCost = descendantEffects.find((effect) => effect.name === "Skill Cost");

		mpCost += ((skillCost?.value || 0) / 100) * mpCost;
	}

	if (range) {
		const skillRange = descendantEffects.find((effect) => effect.name === "Skill Effect Range");

		range += ((skillRange?.value || 0) / 100) * range;
	}

	if (duration) {
		const skillDuration = descendantEffects.find((effect) => effect.name === "Skill Duration");

		duration += ((skillDuration?.value || 0) / 100) * duration;
	}

	return (
		<div className="flex flex-row gap-2 mx-auto">
			<p>{skill.element_type}</p>
			{skill.arche_type && (
				<>
					•<p>{skill.arche_type}</p>
				</>
			)}
			{reload && (
				<>
					•
					<p>
						Reload: <span className={clsx(valueColor(reload, skill.reload!), "font-semibold")}>{getNumberFormatter().format(reload)}s</span>
					</p>
				</>
			)}
			{mpCost && (
				<>
					•
					<p>
						MP cost: <span className={clsx(valueColor(mpCost, skill.MP_cost!), "font-semibold")}>{getNumberFormatter().format(mpCost)}</span>
					</p>
				</>
			)}
			{range && (
				<>
					•
					<p>
						{isRadius ? "Radius" : "Range"}:{" "}
						<span className={clsx(valueColor(range, skill.range!, true), "font-semibold")}>{getNumberFormatter().format(range)}m</span>
					</p>
					•
					<p>
						Max {isRadius ? "Radius" : "Range"}:{" "}
						<span className={"font-semibold"}>{getNumberFormatter().format((skill.max_range_percentage! / 100) * skill.range!)}m</span>
					</p>
				</>
			)}
			{duration && (
				<>
					•
					<p>
						Duration: <span className={clsx(valueColor(duration, skill.duration!, true), "font-semibold")}>{getNumberFormatter().format(duration)}s</span>
					</p>
				</>
			)}
		</div>
	);
}
