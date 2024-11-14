import Stats from "@/components/Stats";
import { Skeleton } from "@/components/ui/skeleton";
import DescendantViewer from "@/components/viewers/DescendantViewer";
import ExternalComponentViewer from "@/components/viewers/ExternalComponentViewer";
import ReactorViewer from "@/components/viewers/ReactorViewer";
import WeaponViewer from "@/components/viewers/WeaponViewer";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Suspense } from "react";

export default function LeftPanel() {
	const mode = useBuildStore((state) => state.mode);

	return (
		<div className="w-[300px] flex flex-col gap-2">
			{mode === "descendant" ? (
				<div className="grid grid-cols-2 gap-2 w-fit">
					<DescendantViewer />
					<Suspense fallback={<Skeleton className="w-[150px] h-[175px] rounded-xl shadow" />}>
						<ReactorViewer />
					</Suspense>
					<ExternalComponentViewer type="auxiliaryPower" />
					<ExternalComponentViewer type="sensor" />
					<ExternalComponentViewer type="memory" />
					<ExternalComponentViewer type="processor" />
				</div>
			) : (
				<WeaponViewer />
			)}
			<Stats mode={mode} />
		</div>
	);
}
