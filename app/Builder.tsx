"use client";

import CenterPanel from "@/components/panels/CenterPanel";
import LeftPanel from "@/components/panels/LeftPanel";
import RightPanel from "@/components/panels/RightPanel";

export default function Builder() {
	return (
		<div className="max-w-[1550px] h-[95vh] m-auto my-[2.5vh]">
			<div className="flex justify-around size-full">
				<LeftPanel />
				<CenterPanel />
				<RightPanel />
			</div>
		</div>
	);
}
