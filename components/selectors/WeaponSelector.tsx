import { getWeapons } from "@/app/api";
import SearchableList from "@/components/SearchableList";
import LargeCard from "@/components/cards/LargeCard";
import SubStatSelector from "@/components/selectors/SubStatSelector";
import { checkIfInRange } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { SubStat, Tier, Weapon } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

const createCommonSubStats = (): SubStat[] => [
	{ name: "Firearm ATK", min: 10, max: 12.2, value: 12.2 },
	{ name: "Weak Point Damage", min: 8.2, max: 12, value: 12 },
	{ name: "Attribute Status Effect Trigger Rate", min: 16.4, max: 24, value: 24 },
	{ name: "Rounds per Magazine", min: 8.2, max: 12, value: 12 },
	{ name: "Recoil", min: -0.124, max: -0.102, value: -0.102 },
	{ name: "Hip Fire Accuracy", min: 10.2, max: 12.4, value: 12.4 },
	{ name: "Weapon Change Speed", min: 11.4, max: 16.5, value: 16.5 },
];

const createWeaponSubStats = (
	atkMin: number,
	atkMax: number,
	critRateMin: number,
	critRateMax: number,
	critDamageMin: number,
	critDamageMax: number,
	bonusAtkMin: number,
	bonusAtkMax: number,
): SubStat[] => [
	{ name: "Fire ATK", min: atkMin, max: atkMax, value: atkMax, flat: true },
	{ name: "Chill ATK", min: atkMin, max: atkMax, value: atkMax, flat: true },
	{ name: "Electric ATK", min: atkMin, max: atkMax, value: atkMax, flat: true },
	{ name: "Toxic ATK", min: atkMin, max: atkMax, value: atkMax, flat: true },
	{ name: "Firearm Critical Hit Rate", min: critRateMin, max: critRateMax, value: critRateMax },
	{ name: "Firearm Critical Hit Damage", min: critDamageMin, max: critDamageMax, value: critDamageMax },
	{ name: "Bonus Firearm ATK (vs. Colossus)", min: bonusAtkMin, max: bonusAtkMax, value: bonusAtkMax, flat: true },
	{
		name: "Bonus Firearm ATK (vs. Legion of Darkness)",
		min: bonusAtkMin,
		max: bonusAtkMax,
		value: bonusAtkMax,
		flat: true,
	},
	{
		name: "Bonus Firearm ATK (vs. Order of Truth)",
		min: bonusAtkMin,
		max: bonusAtkMax,
		value: bonusAtkMax,
		flat: true,
	},
	{
		name: "Bonus Firearm ATK (vs. Legion of Immortality)",
		min: bonusAtkMin,
		max: bonusAtkMax,
		value: bonusAtkMax,
		flat: true,
	},
	...createCommonSubStats(),
];

const subStatsByWeaponType: Record<string, SubStat[]> = {
	"Submachine Gun": createWeaponSubStats(680, 1226, 11.9, 13.3, 30.2, 36.8, 1360, 2453),
	"Assault Rifle": createWeaponSubStats(931, 1679, 14, 15.2, 36.9, 44.9, 1360, 2453),
	Shotgun: createWeaponSubStats(1001, 1806, 8, 9.8, 9.1, 11.1, 2002, 3612),
	"Hand Cannon": createWeaponSubStats(3236, 5838, 9.9, 11.4, 17.7, 21.5, 6473, 11676),
	"Machine Gun": createWeaponSubStats(944, 1702, 13, 14.3, 33.8, 41.1, 1887, 3404),
	"Sniper Rifle": createWeaponSubStats(8424, 15197, 9.3, 10.8, 15.2, 18.4, 16848, 30394),
	Handgun: createWeaponSubStats(683, 1232, 11.9, 13.3, 30.2, 36.8, 1366, 2465),
	"Tactical Rifle": createWeaponSubStats(960, 1731, 10.8, 12.2, 20.2, 24.7, 1919, 3462),
	"Scout Rifle": createWeaponSubStats(2631, 4747, 11.9, 13.3, 26.8, 32.7, 5263, 9494),
	"Beam Rifle": createWeaponSubStats(1101, 1986, 11.9, 13.3, 30.2, 36.8, 2202, 3972),
	Launcher: createWeaponSubStats(8220, 14829, 9.3, 10.8, 15.2, 18.4, 16439, 29657),
};

export default function WeaponSelector() {
	const weapon = useBuildStore((state) => state.weapon);
	const setWeapon = useBuildStore((state) => state.setWeapon);
	const resetWeaponModule = useBuildStore((state) => state.resetWeaponModule);

	const { data: weapons } = useSuspenseQuery({ queryKey: ["weapons"], queryFn: getWeapons });
	const filteredWeapons = weapons?.filter((wp) => wp.image_url && weapon?.weapon_id !== wp.weapon_id);

	const subStats = weapon?.weapon_type ? subStatsByWeaponType[weapon.weapon_type] : [];

	const handleSubStatChange = (subStatIndex: number) => {
		return (val: string) => {
			if (!weapon) return;

			const newSubStat = [...weapon.subStats];
			newSubStat[subStatIndex] = subStats.find((v) => val === v.name)!;

			setWeapon({ ...weapon, subStats: newSubStat });
		};
	};

	const handleSubStatValueChange = (subStatIndex: number, check: boolean) => {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			if (!weapon || !weapon.subStats[subStatIndex]) return;

			const value = Number(e.target.value);

			const newSubStat = [...weapon.subStats];

			if (!check) {
				newSubStat[subStatIndex] = { ...newSubStat[subStatIndex]!, value };
			} else if (!checkIfInRange(value, weapon.subStats[subStatIndex].min, weapon.subStats[subStatIndex].max)) {
				newSubStat[subStatIndex] = { ...newSubStat[subStatIndex]!, value: weapon.subStats[subStatIndex].max };
			}

			setWeapon({ ...weapon, subStats: newSubStat });
		};
	};

	const deleteSubStat = (subStatIndex: number) => {
		if (!weapon) return;

		const newSubStat = [...weapon.subStats];
		newSubStat[subStatIndex] = null;

		setWeapon({ ...weapon, subStats: newSubStat });
	};

	return (
		<div className="flex flex-col gap-4 size-full">
			<LargeCard tier={weapon?.weapon_tier as Tier}>
				<LargeCard.Header className="w-full" src={weapon?.image_url} name={weapon ? weapon.weapon_name : "Select a weapon"} />
				{weapon && weapon.subStats && (
					<LargeCard.Content>
						{weapon.subStats.map((subStat) => {
							if (!subStat) return;
							return (
								<LargeCard.Stat key={subStat.name}>
									<p>{subStat.name}</p>
									<p>
										{subStat.value}
										{!subStat.flat && "%"}
									</p>
								</LargeCard.Stat>
							);
						})}
					</LargeCard.Content>
				)}
			</LargeCard>
			{weapon && (
				<div>
					{[...Array(4)].map((_, i) => {
						return (
							<SubStatSelector
								key={weapon.weapon_id + i}
								index={i}
								selectValue={weapon.subStats[i]?.name}
								onSelectValueChange={handleSubStatChange(i)}
								selectItems={subStats.filter((v) => !weapon.subStats.some((subStat, index) => index !== i && subStat?.name === v.name))}
								inputValue={weapon.subStats[i]?.value}
								onInputChange={handleSubStatValueChange(i, false)}
								onInputBlur={handleSubStatValueChange(i, true)}
								onDelete={() => deleteSubStat(i)}
								min={weapon.subStats[i]?.min}
								max={weapon.subStats[i]?.max}
							/>
						);
					})}
				</div>
			)}
			<SearchableList
				list={filteredWeapons}
				type="weapon"
				onClick={(wp) => {
					setWeapon(wp as Weapon);
					if (weapon && weapon.weapon_rounds_type !== (wp as Weapon).weapon_rounds_type) resetWeaponModule();
				}}
			/>
		</div>
	);
}
