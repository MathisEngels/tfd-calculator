import { getEnemiesGroups } from "@/app/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Enemy, PenetrationType } from "@/types";
import { CaretSortIcon, CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function EnemySelector() {
	const [open, setOpen] = useState(false);

	const against = useBuildStore((state) => state.against);
	const setSelectedEnemy = useBuildStore((state) => state.setEnemy);
	const setPenetrationType = useBuildStore((state) => state.setPenetrationType);
	const setEnemyAndPenetrationType = useBuildStore((state) => state.setEnemyAndPenetrationType);

	const { data: enemiesGroup } = useSuspenseQuery({
		queryKey: ["getEnemiesGroups"],
		queryFn: getEnemiesGroups,
		staleTime: Infinity,
	});

	const onSelectHandler = (enemy: Enemy) => () => {
		setOpen(false);

		if (enemy.name === "Immortality") {
			setEnemyAndPenetrationType(enemy, "burst");
		} else if (enemy.name === "Truth") {
			setEnemyAndPenetrationType(enemy, "pierce");
		} else if (enemy.name === "Darkness") {
			setEnemyAndPenetrationType(enemy, "crush");
		} else {
			setSelectedEnemy(enemy);
		}
	};

	const vulgus = ["Immortality", "Truth", "Darkness"];

	return (
		<>
			<div className="flex gap-4 items-center justify-center">
				<p>Against</p>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-[200px] border-slate-600 bg-tfd hover:bg-tfd hover:border-green-500 hover:text-white relative">
							{against.enemy.name}
							<CaretSortIcon className="h-4 w-4 opacity-50 absolute right-2" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandInput placeholder="Search enemy..." />
							<CommandList>
								<CommandEmpty>No enemies found</CommandEmpty>
								{enemiesGroup.map((group) => (
									<CommandGroup key={group.label} heading={group.label}>
										{group.enemies.map((enemy) => (
											<CommandItem key={enemy.name} onSelect={onSelectHandler(enemy)}>
												{enemy.name}
												{enemy.name === against.enemy.name && <CheckIcon className="h-4 w-4 ml-auto text-green-500" />}
											</CommandItem>
										))}
									</CommandGroup>
								))}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				{!vulgus.includes(against.enemy.name) && (
					<Select value={against.penetration} onValueChange={(val) => setPenetrationType(val as PenetrationType)}>
						<SelectTrigger className="capitalize w-[8rem] hover:border-green-500">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{["crush", "pierce", "burst"].map((type) => (
								<SelectItem key={type} value={type} className="capitalize">
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>
			{vulgus.includes(against.enemy.name) && (
				<Alert>
					<ExclamationTriangleIcon color="orange" />
					<AlertTitle>Warning</AlertTitle>
					<AlertDescription>
						Calculation result might not be exact due to Vulgus resistance values not being exact. They are still under investigation.
					</AlertDescription>
				</Alert>
			)}
		</>
	);
}
