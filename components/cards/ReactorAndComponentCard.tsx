import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalComponentType, Tier } from "@/types";
import Image from "next/image";

interface Props {
	type: "reactor" | ExternalComponentType;
	name: string;
	image_url: string;
	tier: Tier;
	onClick?: () => void;
}

const getBgFromTier = (tier: Tier | undefined) => {
	if (tier === "ultimate") return "bg-tfd-grad-ultimate";
	if (tier === "rare") return "bg-tfd-grad-rare";
	return "bg-tfd-grad-standard";
};

export default function ReactorAndComponentCard({ type, name, image_url, tier, onClick }: Props) {
	return (
		<Card
			onClick={() => onClick && onClick()}
			className={cn(
				"flex flex-col items-center justify-between p-2 gap-2 cursor-pointer h-[175px] w-[150px] border-background hover:border-green-500",
				getBgFromTier(tier),
			)}
		>
			<Image src={image_url} alt={name} width={125} height={125} />
			<p className="font-semibold text-base p-1">{name ?? type}</p>
		</Card>
	);
}
