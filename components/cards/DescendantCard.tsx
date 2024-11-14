import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Descendant } from "@/types";

interface Props {
	className?: string;
	descendant: Descendant | null;
	onClick?: () => void;
	selected?: boolean;
}

export default function DescendantCard({ className, descendant, onClick, selected }: Props) {
	const isUltimate = descendant && descendant.descendant_name.startsWith("Ultimate");

	return (
		<Card
			onClick={() => onClick && onClick()}
			className={cn(
				"flex flex-col items-center justify-between p-2 gap-2 cursor-pointer border-background",
				selected ? "hover:border-slate-600" : "hover:border-green-500",
				isUltimate ? "bg-tfd-grad-ultimate" : "bg-tfd-grad-standard",
				className,
			)}
		>
			<div>
				<Avatar className="size-[100px]">
					{descendant ? (
						<>
							<AvatarImage src={descendant.descendant_image_url} />
							<AvatarFallback className="p-2 bg-tfd-accent">{descendant.descendant_name}</AvatarFallback>
						</>
					) : (
						<AvatarFallback className="p-2 text-xl bg-tfd-accent">+</AvatarFallback>
					)}
				</Avatar>
			</div>
			<p className={cn("font-semibold text-base", descendant?.descendant_name && "text-lg")}>{descendant?.descendant_name ?? "Select a Descendant"}</p>
		</Card>
	);
}
