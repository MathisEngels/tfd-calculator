import Calculator from "@/components/Calculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleViewer from "@/components/viewers/ModuleViewer";
import { useBuildStore } from "@/providers/BuildStoreProvider";
import { Mode } from "@/types";

export default function CenterPanel() {
	const mode = useBuildStore((state) => state.mode);
	const setMode = useBuildStore((state) => state.setMode);
	const setSelectedSlot = useBuildStore((state) => state.setSelectedSlot);

	const modes: Mode[] = ["descendant", "weapon"];

	return (
		<div className="w-[58%] flex flex-col gap-2 overflow-y-auto px-2 styled-scrollbar">
			<Tabs
				defaultValue={mode}
				onValueChange={(val) => {
					setMode(val as Mode);
					setSelectedSlot(val as Mode);
				}}
			>
				<TabsList>
					{modes.map((mode, index) => (
						<TabsTrigger key={index} value={mode} className="capitalize">
							{mode}
						</TabsTrigger>
					))}
				</TabsList>
				{modes.map((mode, index) => (
					<TabsContent key={index} value={mode} className="flex flex-col gap-2 max-h-[90vh]">
						<ModuleViewer mode={mode} />
						<Calculator mode={mode} />
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
