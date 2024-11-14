import { LoadingSpinner } from "@/components/ui/spinner";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Mode } from "@/types";
import dynamic from "next/dynamic";
import React from "react";
import WeaponCalculator from "./WeaponCalculator";

interface Props {
	mode: Mode;
}

const descendantComponents: Record<string, React.ComponentType> = {
	"Ultimate Lepic": dynamic(() => import("./descendants/Lepic"), { loading: () => <LoadingSpinner /> }),
	Lepic: dynamic(() => import("./descendants/Lepic"), { loading: () => <LoadingSpinner /> }),
};

const weaponComponents: Record<string, React.ComponentType> = {};

export default function Calculator({ mode }: Props) {
	const weapon = useBuildStore((state) => state.weapon);
	const descendant = useBuildStore((state) => state.descendant);

	if (mode === "descendant") {
		return (
			<div className="flex justify-center items-center gap-2">
				{descendant ? (
					React.createElement(descendantComponents[descendant.descendant_name])
				) : (
					<p className="text-lg font-bold">Please select a Descendant first</p>
				)}
			</div>
		);
	} else {
		return (
			<div className="flex justify-center items-center">
				{weapon ? (
					weapon.weapon_name in weaponComponents ? (
						React.createElement(weaponComponents[weapon.weapon_name])
					) : (
						<WeaponCalculator />
					)
				) : (
					<p className="text-lg font-bold">Please select a Weapon first</p>
				)}
			</div>
		);
	}
}
