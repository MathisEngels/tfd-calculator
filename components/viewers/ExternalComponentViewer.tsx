import ReactorAndComponentCard from "@/components/cards/ReactorAndComponentCard";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { ExternalComponentType } from "@/types";

interface Props {
	type: ExternalComponentType;
}

export default function ExternalComponentViewer({ type }: Props) {
	const externalComponentName = useBuildStore((state) => state.externalComponents[type].external_component_name);
	const externalComponentImageUrl = useBuildStore((state) => state.externalComponents[type].image_url);
	const externalComponentTier = useBuildStore((state) => state.externalComponents[type].external_component_tier);

	const setSelectedSlot = useBuildStore((state) => state.setSelectedSlot);

	return (
		<ReactorAndComponentCard
			type={type}
			name={externalComponentName}
			image_url={externalComponentImageUrl}
			tier={externalComponentTier}
			onClick={() => setSelectedSlot("external", type)}
		/>
	);
}
