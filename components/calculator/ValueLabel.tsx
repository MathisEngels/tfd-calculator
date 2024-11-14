import { getNumberFormatter } from "@/lib/utils";
import clsx from "clsx";

interface Props {
	label: string;
	value: number | string;
	green?: boolean;
	large?: boolean;
}

export default function ValueLabel({ value, label, green, large }: Props) {
	return (
		<div className="bg-tfd-accent p-2 rounded-md text-center">
			<p className="font-light text-xs">{label}</p>
			<p className={clsx("font-semibold mt-2", green && "text-green-500", large && "text-xl")}>
				{typeof value === "number" ? getNumberFormatter().format(value) : value}
			</p>
		</div>
	);
}
