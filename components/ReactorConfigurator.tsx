import { getReactorImageUrl } from "@/app/api";
import LargeCard from "@/components/cards/LargeCard";
import SubStatSelector from "@/components/selectors/SubStatSelector";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getReactorSkillPower } from "@/lib/maths";
import { checkIfInRange, cn, getNumberFormatter } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { SubStat } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";

const subStats: SubStat[] = [
	{ name: "Skill Cost", min: -0.041, max: -0.027, value: -0.027 },
	{ name: "Skill Cooldown", min: -0.074, max: -0.053, value: -0.053 },
	{ name: "Skill Duration UP", min: 0.076, max: 0.106, value: 0.106 },
	{ name: "Skill Effect Range", min: 0.174, max: 0.258, value: 0.258 },
	{ name: "Skill Critical Hit Rate", min: 22.8, max: 33.0, value: 33.0 },
	{ name: "Skill Critical Hit Damage", min: 22.8, max: 33.0, value: 33.0 },
	{ name: "Non-Attribute Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Fire Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Chill Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Electric Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Toxic Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Fusion Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Singular Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Dimension Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "Tech Skill Power Boost Ratio", min: 0.054, max: 0.085, value: 0.085 },
	{ name: "HP Heal Modifier", min: 0.057, max: 0.085, value: 0.085 },
	{ name: "Sub Attack Power", min: 12.5, max: 19.1, value: 19.1 },
	{ name: "Additional Skill ATK When Attacking Colossus", min: 1778.309, max: 2633.561, value: 2633.561, flat: true },
	{
		name: "Additional Skill ATK When Attacking Legion of Darkness",
		min: 1778.309,
		max: 2633.561,
		value: 2633.561,
		flat: true,
	},
	{
		name: "Additional Skill ATK When Attacking Order of Truth",
		min: 1778.309,
		max: 2633.561,
		value: 2633.561,
		flat: true,
	},
	{
		name: "Additional Skill ATK When Attacking Legion of Immortality",
		min: 1778.309,
		max: 2633.561,
		value: 2633.561,
		flat: true,
	},
];

const types = ["non-attribute", "fire", "chill", "electric", "toxic"];
const arches = ["dimension", "fusion", "singular", "tech"];

export default function ReactorConfigurator() {
	const setReactor = useBuildStore((state) => state.setReactor);
	const reactor = useBuildStore((state) => state.reactor);

	const { data } = useSuspenseQuery({
		queryKey: ["reactorImageUrl"],
		queryFn: getReactorImageUrl,
	});

	const handleSubStatChange = (subStatIndex: number) => {
		return (val: string) => {
			const newSubStat = [...reactor.subStat];
			newSubStat[subStatIndex] = subStats.find((v) => val === v.name)!;

			setReactor("subStat", newSubStat);
		};
	};
	const handleSubStatValueChange = (subStatIndex: number, check: boolean) => {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			if (!reactor.subStat[subStatIndex]) return;
			const value = Number(e.target.value);

			const newSubStat = [...reactor.subStat];

			if (!check) {
				newSubStat[subStatIndex] = { ...newSubStat[subStatIndex]!, value };
			} else if (!checkIfInRange(value, reactor.subStat[subStatIndex].min, reactor.subStat[subStatIndex].max)) {
				newSubStat[subStatIndex] = { ...newSubStat[subStatIndex]!, value: reactor.subStat[subStatIndex].max };
			}

			setReactor("subStat", newSubStat);
		};
	};
	const handleSubStatDelete = (subStatIndex: number) => {
		return () => {
			const newSubStat = [...reactor.subStat];
			newSubStat[subStatIndex] = null;

			setReactor("subStat", newSubStat);
		};
	};

	return (
		<div className="flex flex-col gap-4 w-[300px]">
			<LargeCard tier={reactor.tier}>
				<LargeCard.Header name={reactor.name} src={data![reactor.name]}>
					<div className="flex gap-4">
						<div className={cn("bg-transparent border border-slate-600 size-3 rotate-45", reactor.lvl > 0 && "bg-orange-500 border-orange-500")} />
						<div className={cn("bg-transparent border border-slate-600 size-3 rotate-45", reactor.lvl > 1 && "bg-orange-500 border-orange-500")} />
					</div>
				</LargeCard.Header>
				<LargeCard.Content>
					<LargeCard.Stat>
						<p>Skill Power</p>
						<p>{getNumberFormatter().format(getReactorSkillPower(reactor))}</p>
					</LargeCard.Stat>
					{reactor.tier !== "normal" && (
						<LargeCard.Stat>
							<p>Optimization Skill Power Bonus</p>
							<p className={cn(reactor.optimized ? "text-green-500" : "text-red-500")}>{reactor.optimizationMultiplier * 100}%</p>
						</LargeCard.Stat>
					)}
					<LargeCard.Stat>
						<p className="capitalize">{reactor.type} Skill Power Boost Ratio</p>
						<p>0.2x</p>
					</LargeCard.Stat>
					<LargeCard.Stat>
						<p className="capitalize">{reactor.arche} Skill Power Boost Ratio</p>
						<p>0.2x</p>
					</LargeCard.Stat>
					{[0, 1].map((i) => {
						return (
							reactor.subStat[i] && (
								<LargeCard.Stat key={i}>
									<p>{reactor.subStat[i].name}</p>
									<p>{getNumberFormatter().format(reactor.subStat[i].value)}</p>
								</LargeCard.Stat>
							)
						);
					})}
				</LargeCard.Content>
			</LargeCard>
			<div className="flex flex-col gap-4">
				<Tabs value={reactor.tier} onValueChange={(val) => setReactor("tier", val)}>
					<TabsList>
						<TabsTrigger value="ultimate">Ultimate</TabsTrigger>
						<TabsTrigger value="rare">Rare</TabsTrigger>
						<TabsTrigger value="standard">Standard</TabsTrigger>
					</TabsList>
				</Tabs>
				<Tabs value={reactor.lvl.toString()} onValueChange={(val) => setReactor("lvl", Number(val))}>
					<TabsList>
						<TabsTrigger value="0">Lvl 0</TabsTrigger>
						<TabsTrigger value="1">Lvl 1</TabsTrigger>
						<TabsTrigger value="2">Lvl 2</TabsTrigger>
					</TabsList>
				</Tabs>
				<RadioGroup className="flex justify-evenly" value={reactor.type} onValueChange={(val) => setReactor("type", val)}>
					{types.map((type) => {
						return (
							<div key={type}>
								<RadioGroupItem value={type} id={type} className="peer sr-only" />
								<Label
									htmlFor={type}
									className="flex items-center bg-tfd rounded-md border border-tfd p-1 opacity-50 hover:border-green-500 peer-data-[state=checked]:opacity-100 peer-data-[state=checked]:border-slate-600"
								>
									<Image src={`/types/${type}.png`} width={35} height={35} alt={type} />
								</Label>
							</div>
						);
					})}
				</RadioGroup>
				<RadioGroup className="flex justify-evenly" value={reactor.arche} onValueChange={(val) => setReactor("arche", val)}>
					{arches.map((arche) => {
						return (
							<div key={arche}>
								<RadioGroupItem value={arche} id={arche} className="peer sr-only" />
								<Label
									htmlFor={arche}
									className="flex items-center bg-tfd rounded-md border border-tfd p-1 opacity-50 hover:border-green-500 peer-data-[state=checked]:opacity-100 peer-data-[state=checked]:border-slate-600"
								>
									<Image src={`/arches/${arche}.png`} width={35} height={35} alt={arche} />
								</Label>
							</div>
						);
					})}
				</RadioGroup>
				{reactor.tier !== "normal" && (
					<>
						<div className="flex items-center justify-center gap-4">
							<Label htmlFor="optimized" className="font-semibold text-md">
								Optimized
							</Label>
							<Switch id="optimized" checked={reactor.optimized} onClick={() => setReactor("optimized", !reactor.optimized)} />
						</div>
						<div className="flex flex-col gap-2">
							{[0, 1].map((i) => (
								<SubStatSelector
									key={i}
									index={i}
									selectValue={reactor.subStat[i]?.name}
									onSelectValueChange={handleSubStatChange(i)}
									selectItems={subStats.filter((v) => !reactor.subStat.some((subStat, index) => index !== i && subStat?.name === v.name))}
									inputValue={reactor.subStat[i]?.value}
									onInputChange={handleSubStatValueChange(i, false)}
									onInputBlur={handleSubStatValueChange(i, true)}
									onDelete={handleSubStatDelete(i)}
									min={reactor.subStat[i]?.min}
									max={reactor.subStat[i]?.max}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
