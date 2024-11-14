import { getNumberFormatter } from "@/lib/utils";
import { ReactNode } from "react";

interface DefaultProps {
	title?: string;
	label: string;
	value: number;
	duration: number;
}

interface TitleAndCustomProps {
	title: string;
	children: ReactNode;
}

type Props = DefaultProps | TitleAndCustomProps;

export default function Effect(props: Props) {
	const isDefaultProps = (props: Props): props is DefaultProps => "label" in props && "value" in props && "duration" in props;

	return (
		<div className="bg-tfd-accent rounded-md p-2 flex flex-col items-center gap-2 max-w-48">
			{props.title && <p className="font-semibold">{props.title}</p>}
			{isDefaultProps(props) ? (
				<>
					<p className="font-semibold">{props.label}</p>
					<p>
						<span className="font-semibold">{getNumberFormatter().format(props.value)}</span>% for <span className="font-semibold">{props.duration}</span>{" "}
						seconds
					</p>
				</>
			) : (
				props.children
			)}
		</div>
	);
}
