import { cn } from "@/lib/utils";
import { Tier } from "@/types";
import Image from "next/image";
import { ReactNode } from "react";

interface Props {
	tier?: Tier;
	children: ReactNode;
}

function getBgByTier(tier?: Tier) {
	const _tier = tier?.toLocaleLowerCase();
	if (_tier === "ultimate") return "bg-tfd-grad-ultimate";
	if (_tier === "rare") return "bg-tfd-grad-rare";
	if (_tier === "standard" || _tier === "normal") return "bg-tfd-grad-standard";
	return "bg-tfd";
}

export default function LargeCard({ tier, children }: Props) {
	return (
		<div className={cn("flex flex-col p-2 border border-slate-600 rounded-md justify-around min-h-[175px]", getBgByTier(tier))}>
			<div className="flex flex-col gap-2 justify-center items-center">{children}</div>
		</div>
	);
}

interface LargeCardHeaderProps {
	name?: string;
	src?: string;
	className?: string;
	children?: ReactNode;
}

function LargeCardHeader({ name, src, children, className, ...rest }: LargeCardHeaderProps) {
	return (
		<>
			{((name && src) || children) && (
				<div className={cn("flex flex-col gap-1 justify-center items-center", className)} {...rest}>
					{name && src && <Image src={src} alt={name} width={300} height={300} className="size-full" />}
					{children}
				</div>
			)}
			{name && <p className="font-semibold text-lg text-center">{name}</p>}
		</>
	);
}

function LargeCardContent({ children }: { children: ReactNode }) {
	return <div className="flex flex-col gap-1 w-full">{children}</div>;
}

function LargeCardStat({ children }: { children: ReactNode }) {
	return <div className="flex justify-between w-full text-sm font-light">{children}</div>;
}

LargeCard.Header = LargeCardHeader;
LargeCard.Content = LargeCardContent;
LargeCard.Stat = LargeCardStat;
