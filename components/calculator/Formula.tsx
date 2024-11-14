import React from "react";
import ValueLabel from "./ValueLabel";

interface Props {
	label: string;
	leftValues: {
		value: number;
		label: string;
	}[];
	rightValue: {
		value: number;
		label: string;
	};
	symbols: string[];
	parantheses?: number[][];
	green?: boolean;
	large?: boolean;
	className?: string;
}

export default function Formula({ label, leftValues, rightValue, symbols, parantheses, green, large, className }: Props) {
	return (
		<div className={className}>
			<p className="font-semibold text-center">{label}</p>
			<div className="flex justify-center items-center gap-2 mt-2">
				{leftValues.map((leftValue, index) => {
					const openParanthesisCount = parantheses?.filter((pair) => pair[0] === index).length || 0;
					const closeParanthesisCount = parantheses?.filter((pair) => pair[1] === index).length || 0;

					return (
						<React.Fragment key={index}>
							{openParanthesisCount > 0 && <span className="whitespace-nowrap">{" (".repeat(openParanthesisCount)}</span>}
							<ValueLabel label={leftValue.label} value={leftValue.value} />
							{closeParanthesisCount > 0 && <span className="whitespace-nowrap">{") ".repeat(closeParanthesisCount)}</span>}
							{index < leftValues.length - 1 && <span>{symbols[index % symbols.length]}</span>}
						</React.Fragment>
					);
				})}
				=
				<ValueLabel label={rightValue.label} value={rightValue.value} green={green} large={large} />
			</div>
		</div>
	);
}
