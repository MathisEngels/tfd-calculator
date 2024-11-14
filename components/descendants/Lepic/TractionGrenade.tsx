import DescendantCalculator from "@/components/DescendantCalculator";
import { LepicSkill } from "@/components/descendants/Lepic";

export default function TractionGrenade({ skill }: LepicSkill) {
	return <DescendantCalculator.Skill skill={skill} hideEnemySelector />;
}
