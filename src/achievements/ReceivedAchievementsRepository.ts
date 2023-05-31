import { Connection } from "../Database";
import { EntityFactory } from "../entity/EntityFactory";
import { ReceivedAchievement } from "./ReceivedAchievement";

class ReceivedAchievementRepositoryClass extends EntityFactory<ReceivedAchievement> {
    public async GetAchievement(userId: number, achievementId: number) {

        const entries = await this.Repository().where("userId", userId)
            .andWhere("achievementId", achievementId).select();

        if (entries.length) {
            return entries[0] as ReceivedAchievement;
        }
    }
}

export const ReceivedAchievementConnection = () => Connection<ReceivedAchievement>("ReceivedAchievements");
export const ReceivedAchievementsRepository = new ReceivedAchievementRepositoryClass(ReceivedAchievementConnection);