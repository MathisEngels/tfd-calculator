import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Module } from "@/types";
import Image from "next/image";

interface Props {
	module?: Module | null;
	onClick?: () => void;
	onClose?: (_id: string) => void;
	selected?: boolean;
	noHover?: boolean;
}

export default function ModuleCard({ module, onClick, onClose, selected, noHover }: Props) {
	const borderColor = (!!!onClose && module) || selected ? "border-slate-600" : "border-transparent";
	const onHoverBorderColor = !!!onClose && module ? "border-green-500" : "border-slate-600";

	if (!module) return <EmptyModuleCard onClick={onClick} borderColor={borderColor} />;

	const tierBackgrounds: Record<string, string> = {
		Rare: "bg-tfd-module-rare",
		Ultimate: "bg-tfd-module-ultimate",
		Transcendent: "bg-tfd-module-transcendent",
	};

	const backgroundClass = tierBackgrounds[module.module_tier] || "bg-tfd-module-standard";

	const effectString = module.module_effects
		.map((effect) => {
			return `${effect.name}: ${effect.value}${!effect.flat && "%"}`;
		})
		.join(", ");

	const isNotDefinedAndTrans = module.module_defined === false && module.module_tier === "Transcendent";
	const isNotSupported =
		(!module.supported && module.module_tier === "Transcendent") ||
		(module.module_effects.length === 0 && module.module_subclass?.type !== "subAttack" && module.module_tier !== "Transcendent");

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="relative w-full">
					{!!onClose && (
						<div
							onClick={() => onClose(module.module_id)}
							className="absolute top-0 left-0 bg-background text-red-600 border border-tfd-accent rounded-full size-6 -translate-x-2 -translate-y-2 z-10 hover:border-red-800 "
						>
							✖
						</div>
					)}
					<Card onClick={() => onClick && onClick()} className={cn(`flex flex-col justify-between ${borderColor}`, !noHover && `hover:${onHoverBorderColor}`)}>
						<div className="relative flex flex-col items-center h-full pt-4">
							<div className="absolute top-1 right-1 flex flex-col gap-1">
								<Image src={`/classes/${module.module_class.toLowerCase()}.png`} width={24} height={24} alt={module.module_class} />
								{isNotSupported && <div>⚠️</div>}
								{isNotDefinedAndTrans && <div>🛑</div>}
							</div>
							<Image className={`${backgroundClass} border-2 rounded-md`} src={module.image_url} width={64} height={64} alt={module.module_name} />
							<div className="text-base leading-4 p-[2px] my-auto">{module.module_name}</div>
						</div>
						<div className="flex items-center p-2 bg-tfd-accent text-sm text-gray-400">
							<div className="w-1/4">
								<Image
									className="mx-auto"
									src={`/socket-types/${module.module_socket_type.toLowerCase()}.png`}
									width={20}
									height={20}
									alt={module.module_socket_type}
								/>
							</div>
							<div className="w-3/4">{module.module_type || "-"}</div>
						</div>
					</Card>
				</TooltipTrigger>

				<TooltipContent className="text-center max-w-[33vw]">
					{isNotSupported && <p className="text-red-600">⚠️ NOT SUPPORTED</p>}
					{isNotDefinedAndTrans && <p className="text-red-600">🛑 MOD NOT DEFINED AS TRANSCENDENT ! CONTACT ADMIN plz!</p>}
					<p>{effectString}</p>
					{module.module_explanation && <p>Explanation: {module.module_explanation}</p>}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function EmptyModuleCard({ onClick, borderColor }: Props & { borderColor: string }) {
	return (
		<Card onClick={() => onClick && onClick()} className={`flex flex-col w-full justify-between ${borderColor} hover:border-slate-600 cursor-pointer`}>
			<div className="flex flex-col items-center h-full pt-4">
				<Chipset />
			</div>
			<div className="flex justify-center p-2 bg-tfd-accent text-sm text-gray-400">-</div>
		</Card>
	);
}

function Chipset() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="64"
			height="64"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
			<rect x="9" y="9" width="6" height="6"></rect>
			<line x1="9" y1="1" x2="9" y2="4"></line>
			<line x1="15" y1="1" x2="15" y2="4"></line>
			<line x1="9" y1="20" x2="9" y2="23"></line>
			<line x1="15" y1="20" x2="15" y2="23"></line>
			<line x1="20" y1="9" x2="23" y2="9"></line>
			<line x1="20" y1="14" x2="23" y2="14"></line>
			<line x1="1" y1="9" x2="4" y2="9"></line>
			<line x1="1" y1="14" x2="4" y2="14"></line>
		</svg>
	);
}
