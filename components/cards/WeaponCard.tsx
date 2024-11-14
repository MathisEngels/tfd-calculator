import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Weapon } from "@/types";
import Image from "next/image";

interface Props {
	className?: string;
	weapon: Weapon | null;
	onClick?: () => void;
}

export default function WeaponCard({ className, weapon, onClick }: Props) {
	const bgColors: Record<Weapon["weapon_tier"], string> = {
		Normal: "bg-tfd-grad-standard",
		Rare: "bg-tfd-grad-rare",
		Ultimate: "bg-tfd-grad-ultimate",
	};

	return (
		<Card
			onClick={() => onClick && onClick()}
			className={cn(
				"flex flex-col items-center justify-between p-2 gap-2 cursor-pointer border-background w-full relative h-[135px] hover:border-green-500",
				weapon && bgColors[weapon.weapon_tier],
				className,
			)}
		>
			{weapon ? (
				<>
					<Image src={weapon.image_url} fill alt={weapon.weapon_name} sizes="100%" className="!h-auto !relative" />
					<p className="font-semibold text-lg">{weapon.weapon_name}</p>
					<Image
						src={`/classes/${weapon.weapon_rounds_type.toLowerCase()}.png`}
						width={24}
						height={24}
						alt={weapon.weapon_rounds_type}
						className="absolute right-2"
					/>
				</>
			) : (
				<p className="text-lg font-semibold my-auto">Select a weapon</p>
			)}
		</Card>
	);
}
