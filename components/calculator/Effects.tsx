import EffectContainer from "@/components/calculator/EffectContainer";
import { DescendantSkill } from "@/types";
import Effect from "./Effect";

interface Props {
	skill: DescendantSkill;
}

export default function Effects({ skill }: Props) {
	if (!skill.effects) return;

	return (
		<EffectContainer>
			{skill.effects.map((effect, index) => (
				<Effect key={index} {...effect} />
			))}
		</EffectContainer>
	);
}
