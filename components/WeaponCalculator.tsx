import Formula from "@/components/calculator/Formula";
import FormulaContainer from "@/components/calculator/FormulaContainer";
import WeaponStats from "@/components/calculator/WeaponStats";
import EnemySelector from "@/components/selectors/EnemySelector";
import { Accordion } from "@/components/ui/accordion";
import { getWeaponDamage } from "@/lib/maths";
import { extractForWeapon } from "@/lib/utils";
import { useBuildStore } from "@/providers/BuildStoreProvider";

export default function WeaponCalculator() {
	const weapon = useBuildStore((state) => state.weapon)!;
	const against = useBuildStore((state) => state.against);
	const modules = useBuildStore((state) => state.module.weapon);

	const effects = extractForWeapon(weapon, modules);
	const { baseDamage, physicalDamage, attributesValues, firearmATKBonus, factionATKBonus, applicablePhysicalBonus } = getWeaponDamage(
		weapon,
		against.enemy,
		effects,
		against.penetration,
	);

	const weaponCritDamage = effects.find((effect) => effect.name === "Firearm Critical Hit Damage");
	const weaponCritRate = effects.find((effect) => effect.name === "Firearm Critical Hit Rate");
	const fireRate = effects.find((effect) => effect.name === "Fire Rate");

	let critDamagePrct = weapon.critical_hit_damage || 1;
	let critRatePrct = 1 + (weapon.critical_hit_rate || 100) / 100;
	let fireRatePrct = weapon.fire_rate || 1;

	if (weaponCritDamage) critDamagePrct *= 1 + weaponCritDamage.value / 100;
	if (weaponCritRate) critRatePrct *= 1 + weaponCritRate.value / 100;
	if (fireRate) fireRatePrct *= 1 + fireRate.value / 100;

	const attributeSumDmg = Object.values(attributesValues).reduce((acc, curr) => acc + curr.value, 0);
	const totalDamage = physicalDamage + attributeSumDmg;

	const critDamage = totalDamage * critDamagePrct;
	const critComposite = 1 + critRatePrct * (critDamagePrct - 1);
	const averageDamage = totalDamage * critComposite;

	const dps = averageDamage * (fireRatePrct / 60);

	return (
		<div className="bg-tfd rounded-md p-4 flex flex-col gap-2 w-full">
			<h3 className="text-center text-xl">{weapon.weapon_name}</h3>
			<WeaponStats weapon={weapon} fireRate={fireRatePrct} reloadTime={weapon.reload_time || 0} magazineSize={weapon.magazine_size || 0} />
			<EnemySelector />

			<Formula
				className="mt-2"
				label="DPS"
				leftValues={[
					{ label: "One Bullet Average Damage", value: averageDamage },
					{ label: "Fire Rate per second", value: fireRatePrct / 60 },
				]}
				rightValue={{ label: "DPS", value: dps }}
				symbols={["x"]}
				green
				large
			/>
			<Accordion type="multiple" className="flex flex-col gap-2">
				<FormulaContainer title="One Bullet Damage" damage={averageDamage}>
					<Formula
						label="Base Damage"
						leftValues={[
							{ label: "Base Firearm ATK", value: weapon.firearm_atk },
							{ label: "Firearm ATK Bonus", value: 1 + firearmATKBonus },
						]}
						rightValue={{ label: "Base Damage", value: baseDamage }}
						symbols={["x"]}
						green
					/>
					<Formula
						label="Physical Damage"
						leftValues={[
							{ label: "Base Damage", value: baseDamage },
							{ label: "Faction ATK", value: factionATKBonus },
							{ label: "Physical Bonus", value: 1 + applicablePhysicalBonus },
						]}
						rightValue={{ label: "Physical Damage", value: physicalDamage }}
						symbols={["+", "x"]}
						parantheses={[[0, 1]]}
						green
					/>
					{["Fire", "Electric", "Toxic", "Chill"].map((element) => {
						const attributeValues = attributesValues[element as keyof typeof attributesValues];
						return (
							<Formula
								key={element}
								label={`${element} Damage`}
								leftValues={[
									{ label: `Weapon Roll ${element} ATK`, value: attributeValues.flatAttributeSubStat },
									{ label: "Base Damage", value: baseDamage },
									{ label: `Conversion Rate to ${element} ATK`, value: attributeValues.conversionRate },
									{ label: `${element} ATK % Bonus`, value: 1 + attributeValues.attributeATKBonus },
								]}
								rightValue={{ label: `${element} Damage`, value: attributeValues.value }}
								symbols={["+", "x", "x"]}
								parantheses={[
									[1, 2],
									[0, 2],
								]}
								green
							/>
						);
					})}
					<Formula
						label="Total Damage"
						leftValues={[
							{ label: "Physical Damage", value: physicalDamage },
							{ label: "Fire Damage", value: attributesValues.Fire.value },
							{ label: "Electric Damage", value: attributesValues.Electric.value },
							{ label: "Toxic Damage", value: attributesValues.Toxic.value },
							{ label: "Chill Damage", value: attributesValues.Chill.value },
						]}
						rightValue={{ label: "Total Damage", value: totalDamage }}
						symbols={["+"]}
						green
					/>
					<Formula
						label="Critical Damage"
						leftValues={[
							{ label: "Total Damage", value: totalDamage },
							{ label: "Critical Hit Damage", value: critDamagePrct },
						]}
						rightValue={{ label: "Critical Damage", value: critDamage }}
						symbols={["x"]}
						green
					/>
					<Formula
						label="Average Damage"
						leftValues={[
							{ label: "Crit Composite", value: critComposite },
							{ label: "Damage", value: totalDamage },
						]}
						rightValue={{ label: "Average Damage", value: averageDamage }}
						symbols={["x"]}
						green
						large
					/>
				</FormulaContainer>
			</Accordion>
		</div>
	);
}
