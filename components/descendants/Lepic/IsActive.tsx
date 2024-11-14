import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
	label: string;
	isActive: boolean;
	setIsActive: (val: boolean) => void;
}

export default function IsActive({ label, isActive, setIsActive }: Props) {
	return (
		<div className="flex items-center justify-center gap-2">
			<Label htmlFor={label} className="font-semibold text-lg">
				Is {label} Active?
			</Label>
			<Switch id={label} checked={isActive} onCheckedChange={(val) => setIsActive(val)} />
		</div>
	);
}
