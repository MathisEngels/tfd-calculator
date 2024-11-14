import ModuleCard from "@/components/cards/ModuleCard";
import WeaponCard from "@/components/cards/WeaponCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Module, Rarity, SocketType, Weapon } from "@/types";
import { useState } from "react";

interface Props {
	list: (Module | Weapon)[];
	type: "module" | "weapon";
	onClick: (item: Module | Weapon) => void;
}

export default function SearchableList({ list, type, onClick }: Props) {
	const [name, setName] = useState<string>("");
	const [rarity, setRarity] = useState<Rarity>("all");
	const [socketType, setSocketType] = useState<SocketType>("all");

	const filteredList = list.filter((item) => {
		if (type === "module") {
			const mod = item as Module;

			if (rarity !== "all" && mod.module_tier !== rarity) return false;
			if (socketType !== "all" && mod.module_socket_type !== socketType) return false;
			if (name && !mod.module_name.toLowerCase().includes(name.toLowerCase())) return false;

			return true;
		} else {
			const wp = item as Weapon;

			if (rarity !== "all" && wp.weapon_tier.toLowerCase() !== rarity) return false;
			if (name && !wp.weapon_name.toLowerCase().includes(name.toLowerCase())) return false;

			return true;
		}
	});

	return (
		<div className="flex flex-col flex-1 gap-4 overflow-auto">
			<div className="flex gap-2 justify-between">
				<div>
					<Label htmlFor="search">Search by name</Label>
					<Input id="search" placeholder="Search..." value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<div>
					<Label htmlFor="rarity">Rarity</Label>
					<Select value={rarity} onValueChange={(val) => setRarity(val as Rarity)}>
						<SelectTrigger className="capitalize" id="rarity">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{["all", "normal", "rare", "ultimate"].map((tier) => (
								<SelectItem key={tier} value={tier} className="capitalize">
									{tier}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{type === "module" && (
					<div>
						<Label htmlFor="socket-type">Socket</Label>
						<Select value={socketType} onValueChange={(val) => setSocketType(val as SocketType)}>
							<SelectTrigger className="capitalize" id="rarity">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{["all", "almandine", "cerulean", "malachite", "rutile", "xantic"].map((tier) => (
									<SelectItem key={tier} value={tier} className="capitalize">
										{tier}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>
			<div className={cn(type === "module" ? "grid grid-cols-2" : "flex flex-wrap", "gap-2 pr-2 overflow-auto styled-scrollbar")}>
				{filteredList.map((item) => {
					if (type === "module") {
						const mod = item as Module;

						return <ModuleCard key={mod.module_id + mod.module_name} module={mod} onClick={() => onClick(mod)} />;
					} else {
						const weapon = item as Weapon;

						return (
							<WeaponCard
								key={weapon.weapon_id}
								weapon={weapon}
								onClick={() => {
									onClick(weapon);
									setName("");
								}}
							/>
						);
					}
				})}
			</div>
		</div>
	);
}
