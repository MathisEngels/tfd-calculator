import Damage from "@/components/calculator/Damage";
import Effects from "@/components/calculator/Effects";
import SkillStats from "@/components/calculator/SkillStats";
import EnemySelector from "@/components/selectors/EnemySelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DescendantSkill as TDescendantSkill } from "@/types";
import Image from "next/image";

interface Props {
	skills: TDescendantSkill[];
	children: React.ReactNode;
}

export default function DescendantCalculator({ skills, children }: Props) {
	return (
		<Tabs className="w-full" defaultValue={skills[0].skill_name}>
			<TabsList className="h-12">
				{skills.map((skill) => {
					return (
						<TabsTrigger value={skill.skill_name} key={skill.skill_name}>
							<Image src={skill.skill_image_url} width={32} height={32} alt={skill.skill_name} />
						</TabsTrigger>
					);
				})}
			</TabsList>
			{children}
		</Tabs>
	);
}

interface DescendantSkillProps {
	skill: TDescendantSkill;
	children?: React.ReactNode;
	additionalDamage?: {
		averageDamage: number;
		component: React.JSX.Element;
		label: string;
	}[];
	isRadius?: boolean;
	hideEnemySelector?: boolean;
	hideEffects?: boolean;
	hideDamage?: boolean;
	hideSum?: boolean;
	hitLabel?: string;
	tickLabel?: string;
}

function DescendantSkill({
	skill,
	children,
	additionalDamage,
	isRadius,
	hideEnemySelector,
	hideEffects,
	hideDamage,
	hideSum,
	hitLabel,
	tickLabel,
}: DescendantSkillProps) {
	return (
		<TabsContent value={skill.skill_name}>
			<div className="bg-tfd rounded-md p-4 flex flex-col gap-2">
				<h3 className="text-center text-xl">{skill.skill_name}</h3>
				<p className="text-center text-gray-400">{skill.skill_description}</p>
				<SkillStats skill={skill} isRadius={isRadius} />
				{!hideEnemySelector && <EnemySelector />}
				{!hideEffects && <Effects skill={skill} />}
				{children}
				{!hideDamage && <Damage skill={skill} additionalDamage={additionalDamage} hideSum={hideSum} hitLabel={hitLabel} tickLabel={tickLabel} />}
			</div>
		</TabsContent>
	);
}

DescendantCalculator.Skill = DescendantSkill;
