import { Connection } from "../Database";
import { EntityFactory } from "../entity/EntityFactory";
import { Achievement } from "./Achievement";

class AchievementRepositoryClass extends EntityFactory<Achievement> {

}

export const AchievementConnection = () => Connection<Achievement>("Achievements");
export const AchievementRepository = new AchievementRepositoryClass(AchievementConnection);