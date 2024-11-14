import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getNumberFormatter } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
	title: string;
	damage: number;
	children: ReactNode;
}

export default function FormulaContainer({ title, damage, children }: Props) {
	return (
		<div className="flex flex-wrap gap-4 gap-x-8 items-center justify-center bg-tfd-accent2 rounded-md p-4">
			<AccordionItem value={title}>
				<AccordionTrigger className="font-semibold text-xl text-center">
					{title} <span className="text-green-500">({getNumberFormatter().format(damage)})</span>
				</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-2">{children}</AccordionContent>
			</AccordionItem>
		</div>
	);
}
