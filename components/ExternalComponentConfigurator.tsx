import { getExternalComponents } from "@/app/api";
import LargeCard from "@/components/cards/LargeCard";
import SubStatSelector from "@/components/selectors/SubStatSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkIfInRange, getNumberFormatter } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { ExternalComponentType, SubStat } from "@/types/calculator";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
	type: ExternalComponentType;
}

const subStatsByType: Record<ExternalComponentType, SubStat[]> = {
	auxiliaryPower: [
		{ name: "Max HP", min: 411, max: 914, value: 914, flat: true },
		{ name: "Fire Resistance", min: 1608, max: 3860, value: 3860, flat: true },
		{ name: "MP Recovery Out of Combat", min: 1.791, max: 2.454, value: 2.454, flat: true },
		{ name: "Module Drop Rate Increase Modifier", min: 0.125, max: 0.191, value: 0.191 },
		{ name: "Kuiper Shard Drop Rate Increase Modifier", min: 0.111, max: 0.168, value: 0.168 },
		{ name: "DBNO Duration", min: 0.208, max: 0.318, value: 0.318 },
	],
	sensor: [
		{ name: "Max MP", min: 110, max: 159, value: 159, flat: true },
		{ name: "MP Recovery In Combat", min: 0.208, max: 0.287, value: 0.287 },
		{ name: "Chill Resistance", min: 1608, max: 3860, value: 3860, flat: true },
		{ name: "HP Recovery Modifier", min: 0.057, max: 0.085, value: 0.085 },
		{ name: "Shield Recovery Out of Combat", min: 11.311, max: 16.63, value: 16.63, flat: true },
		{ name: "Consumable Drop Rate Increase Modifier", min: 0.125, max: 0.191, value: 0.191 },
		{ name: "Character EXP Gain Modifier", min: 0.125, max: 0.191, value: 0.191 },
	],
	memory: [
		{ name: "DEF", min: 1724, max: 4249, value: 4249, flat: true },
		{ name: "Shield Recovery In Combat", min: 3.271, max: 5.033, value: 5.033, flat: true },
		{ name: "Electric Resistance", min: 1608, max: 3860, value: 3860, flat: true },
		{ name: "MP Recovery Modifier", min: 0.108, max: 0.16, value: 0.16 },
		{ name: "Gold Drop Rate Increase Modifier", min: 0.125, max: 0.191, value: 0.191 },
		{ name: "Firearm Proficiency Gain Modifier", min: 0.125, max: 0.191, value: 0.191 },
		{ name: "Ecive Search Radius Increase Modifier", min: 50.6, max: 76.6, value: 76.6 },
	],
	processor: [
		{ name: "Max Shield", min: 124, max: 283, value: 283, flat: true },
		{ name: "Toxic Resistance", min: 1608, max: 3860, value: 3860, flat: true },
		{ name: "Shield Recovery Modifier", min: 0.057, max: 0.085, value: 0.085 },
		{ name: "Equipment Drop Rate Increase Modifier", min: 0.125, max: 0.191, value: 0.191 },
		{ name: "Item Acquisition Distance Increase Modifier", min: 0.165, max: 0.253, value: 0.191 },
		{ name: "Ecive Display Time", min: 65.5, max: 97.2, value: 97.2 },
	],
};

export default function ExternalComponentConfigurator({ type }: Props) {
	const externalComponent = useBuildStore((state) => state.externalComponents[type]);
	const setExternalComponent = useBuildStore((state) => state.setExternalComponent);

	const { data } = useSuspenseQuery({
		queryKey: ["externalComponents"],
		queryFn: getExternalComponents,
	});
	const components =
		data.filter((component) => component.external_component_equipment_type.toLowerCase() === (type === "auxiliaryPower" ? "auxiliary power" : type)) || [];

	const subStats = subStatsByType[type];

	const handleTierChange = (val: string) => {
		const selectedComponent =
			components.find((component) => component.external_component_tier === val && component.set_name === externalComponent.set_name) ||
			components.find((component) => component.external_component_tier === val);
		if (selectedComponent) {
			setExternalComponent(type, { ...selectedComponent, subStat: externalComponent.subStat });
		}
	};
	const handleSetNameChange = (val: string) => {
		const selectedComponent = components.find(
			(component) => component.set_name === val && component.external_component_tier === externalComponent.external_component_tier,
		);
		if (selectedComponent) {
			setExternalComponent(type, { ...selectedComponent, subStat: externalComponent.subStat });
		}
	};

	const handleSubStatChange = (subStatIndex: number) => (val: string) => {
		const newSubStat = [...externalComponent.subStat];
		newSubStat[subStatIndex] = subStats.find((v) => val === v.name)!;

		setExternalComponent(type, { ...externalComponent, subStat: newSubStat });
	};
	const handleSubStatValueChange = (subStatIndex: number, check: boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!externalComponent.subStat[subStatIndex]) return;
		const value = Number(e.target.value);

		const newSubStat = [...externalComponent.subStat];

		if (!check) {
			newSubStat[subStatIndex] = { ...newSubStat[subStatIndex]!, value };
		} else if (!checkIfInRange(value, externalComponent.subStat[subStatIndex].min, externalComponent.subStat[subStatIndex].max)) {
			newSubStat[subStatIndex] = { ...newSubStat[subStatIndex]!, value: externalComponent.subStat[subStatIndex].max };
		}

		setExternalComponent(type, { ...externalComponent, subStat: newSubStat });
	};
	const handleSubStatDelete = (subStatIndex: number) => () => {
		const newSubStat = [...externalComponent.subStat];
		newSubStat[subStatIndex] = null;

		setExternalComponent(type, { ...externalComponent, subStat: newSubStat });
	};

	return (
		<div className="flex flex-col gap-4 w-[300px]">
			<LargeCard tier={externalComponent.external_component_tier}>
				<LargeCard.Header name={externalComponent.external_component_name} src={externalComponent.image_url} />
				<LargeCard.Content>
					<LargeCard.Stat>
						<p>{externalComponent.stat_type}</p>
						<p>{getNumberFormatter().format(externalComponent.stat_value)}</p>
					</LargeCard.Stat>
					{externalComponent.subStat.map((sub, index) => {
						return (
							sub && (
								<LargeCard.Stat key={index}>
									<p>{sub.name}</p>
									<p>{getNumberFormatter().format(sub.value)}</p>
								</LargeCard.Stat>
							)
						);
					})}
				</LargeCard.Content>
			</LargeCard>

			<div className="flex flex-col gap-4">
				<Tabs value={externalComponent.external_component_tier} onValueChange={handleTierChange}>
					<TabsList>
						<TabsTrigger value="ultimate">Ultimate</TabsTrigger>
						<TabsTrigger value="rare">Rare</TabsTrigger>
						<TabsTrigger value="normal">Standard</TabsTrigger>
					</TabsList>
				</Tabs>
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<Select value={externalComponent.set_name} onValueChange={handleSetNameChange}>
							<SelectTrigger className="w-[200px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{components
									.filter((component) => component.external_component_tier === externalComponent.external_component_tier)
									.map((extComponent) => {
										return (
											<SelectItem key={extComponent.set_name} value={extComponent.set_name}>
												{extComponent.set_name}
											</SelectItem>
										);
									})}
							</SelectContent>
						</Select>
					</div>
					{[0, 1].map((index) => (
						<SubStatSelector
							key={index}
							index={index}
							selectValue={externalComponent.subStat[index]?.name}
							onSelectValueChange={handleSubStatChange(index)}
							selectItems={subStats.filter((v) => !externalComponent.subStat[1 - index]?.name || v.name !== externalComponent.subStat[1 - index]?.name)}
							inputValue={externalComponent.subStat[index]?.value}
							onInputChange={handleSubStatValueChange(index, false)}
							onInputBlur={handleSubStatValueChange(index, true)}
							onDelete={handleSubStatDelete(index)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
