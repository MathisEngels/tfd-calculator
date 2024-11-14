import { getSupportedDescendants } from "@/app/api";
import DescendantCard from "@/components/cards/DescendantCard";
import LargeCard from "@/components/cards/LargeCard";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Tier } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function DescendantSelector() {
	const setDescendant = useBuildStore((state) => state.setDescendant);
	const descendant = useBuildStore((state) => state.descendant);

	const { data } = useSuspenseQuery({
		queryKey: ["supportedDescendants"],
		queryFn: getSupportedDescendants,
	});

	return (
		<div className="flex flex-col gap-4 w-[300px]">
			<LargeCard tier={descendant?.descendant_name.startsWith("Ultimate") ? "ultimate" : ("standard" as Tier)}>
				{!descendant && <p className="font-semibold text-lg">Select a descendant</p>}
				<LargeCard.Header className="rounded-full overflow-hidden h-[175px]" name={descendant?.descendant_name} src={descendant?.descendant_image_url} />
			</LargeCard>
			<div>
				<div className="grid grid-cols-2 gap-2 pr-2 overflow-auto styled-scrollbar">
					{data.map((descendant) => {
						return <DescendantCard key={descendant.descendant_id} descendant={descendant} onClick={() => setDescendant(descendant)} />;
					})}
				</div>
			</div>
		</div>
	);
}
