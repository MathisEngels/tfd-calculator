import { getNumberFormatter, valueColor } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Effect, Mode, Stat } from "@/types";

interface Props {
	mode: Mode;
}

export default function Stats({ mode }: Props) {
	const descendant = useBuildStore((state) => state.descendant);
	const descendantEffects = useBuildStore((state) => state.descendantEffects);
	const descendantStats = useBuildStore((state) => state.descendantStats);
	const weapon = useBuildStore((state) => state.weapon);
	const weaponEffects = useBuildStore((state) => state.weaponEffects);

	let stats: Stat[];
	let effects: Effect[] = mode === "descendant" ? descendantEffects : [];

	if (mode === "descendant") {
		stats =
			descendant?.descendant_stat.map((stat) => ({
				name: stat.stat_type,
				value: Number(stat.stat_value),
			})) || [];

		descendantStats.forEach((stat) => {
			const matchingStat = stats.find((dStat) => dStat.name === stat.name);
			if (matchingStat) {
				matchingStat.value += Number(stat.value);
			} else {
				stats.push(stat);
			}
		});

		stats.forEach((stat) => {
			const effect = descendantEffects.find((effect) => effect.name === stat.name);
			if (effect) {
				stat.value = stat.value * (1 + effect.value / 100);
			}
		});
	} else {
		const flatAttributes = ["Fire ATK", "Electric ATK", "Toxic ATK", "Chill ATK"];
		const flatEffectsMap: { [key: string]: Effect } = {};

		weapon?.subStats.forEach((subStat) => {
			if (subStat && flatAttributes.includes(subStat.name)) {
				flatEffectsMap[subStat.name] = subStat;
			}
		});

		effects = weaponEffects.map((effect) => {
			if (flatAttributes.includes(effect.name)) {
				const weaponSubStat = flatEffectsMap[effect.name];

				if (weaponSubStat) {
					return { ...effect, value: weaponSubStat.value * (1 + effect.value / 100), flat: true };
				} else {
					return { ...effect, flat: false };
				}
			}

			return effect;
		});

		flatAttributes.forEach((attribute) => {
			if (flatEffectsMap[attribute] && !effects.some((effect) => effect.name === attribute)) {
				effects.push({ ...flatEffectsMap[attribute], flat: true });
			}
		});
	}

	return (
		<div className="rounded-md bg-tfd-accent p-2 flex flex-col gap-2 max-h-[33vh] overflow-auto styled-scrollbar">
			{mode === "descendant" && (
				<div className="flex flex-col gap-2">
					<p className="rounded-md bg-tfd p-2">Stats</p>
					{stats!.map((stat, i) => {
						return (
							<div key={i} className="flex justify-between mx-2 text-sm font-light">
								<p>{stat.name}</p>
								<p className={valueColor(stat.value, descendantStats.find((dStat) => dStat.name === stat.name)?.value || 0, true)}>
									{getNumberFormatter().format(stat.value)}
								</p>
							</div>
						);
					})}
				</div>
			)}
			<div className="flex flex-col gap-2">
				<p className="rounded-md bg-tfd p-2">Effects</p>
				{effects.map((effect, i) => {
					return (
						<div key={i} className="flex justify-between mx-2 text-sm font-light">
							<p>{effect.name}</p>
							<p>
								{getNumberFormatter().format(effect.value)}
								{!effect.flat && "%"}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
