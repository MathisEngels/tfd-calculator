import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";

interface Props {
	index: number;
	selectValue?: string;
	onSelectValueChange?: (value: string) => void;
	selectItems: { name: string }[];
	inputValue?: number;
	onInputChange?: React.ChangeEventHandler<HTMLInputElement>;
	onInputBlur?: React.FocusEventHandler<HTMLInputElement>;
	onDelete?: () => void;
	min?: number;
	max?: number;
}

export default function SubStatSelector({
	index,
	selectValue,
	onSelectValueChange,
	selectItems,
	inputValue,
	onInputChange,
	onInputBlur,
	onDelete,
	min,
	max,
}: Props) {
	const [key, setKey] = useState(0);

	return (
		<div>
			<div className="flex items-center justify-between">
				<Select value={selectValue} onValueChange={onSelectValueChange} key={key}>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder={`Sub Stat ${index + 1}`} />
					</SelectTrigger>
					<SelectContent>
						{selectItems.map((stat) => {
							return (
								<SelectItem key={stat.name} value={stat.name}>
									{stat.name}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
				:
				<Input value={inputValue ?? 0} onChange={onInputChange} onBlur={onInputBlur} className="w-[80px]" />
			</div>
			<div className="flex justify-between mx-1 text-sm">
				{selectValue && onDelete && (
					<p
						className="text-red-800 cursor-pointer"
						onClick={() => {
							onDelete();
							setKey((prev) => prev + 1);
						}}
					>
						Delete
					</p>
				)}
				<p className="text-muted ml-auto">
					{min ?? 0} <span className="mx-1">—</span> {max ?? 0}
				</p>
			</div>
		</div>
	);
}
