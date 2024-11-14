import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function EffectContainer({ children }: Props) {
	return (
		<div className="flex gap-4 items-center justify-center">
			<p className="font-semibold">Effects</p>
			{children}
		</div>
	);
}
