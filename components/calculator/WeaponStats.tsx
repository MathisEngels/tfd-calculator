import { getNumberFormatter, valueColor } from "@/lib/utils";
import { Weapon } from "@/types";
import clsx from "clsx";

interface Props {
	weapon: Weapon;
	fireRate: number;
	magazineSize: number;
	reloadTime: number;
}

export default function WeaponStats({ weapon, fireRate, magazineSize, reloadTime }: Props) {
	return (
		<div className="flex flex-row gap-2 mx-auto">
			<p>{weapon.weapon_type}</p>•<p>{weapon.weapon_rounds_type}</p>•<p>{weapon.burst ? "Burst" : weapon.crush ? "Crush" : "Pierce"}</p>•
			<p>
				Fire Rate: <span className={clsx(valueColor(fireRate, weapon.fire_rate || 1, true), "font-semibold")}>{getNumberFormatter().format(fireRate)}</span>
			</p>
			•
			<p>
				Magazine Size:{" "}
				<span className={clsx(valueColor(magazineSize, weapon.magazine_size || 1), "font-semibold")}>{getNumberFormatter().format(magazineSize)}</span>
			</p>
			•
			<p>
				Reload time: <span className={clsx(valueColor(reloadTime, weapon.reload_time || 1), "font-semibold")}>{getNumberFormatter().format(reloadTime)}s</span>
			</p>
		</div>
	);
}
