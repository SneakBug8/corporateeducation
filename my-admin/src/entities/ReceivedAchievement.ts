import { Entity } from "../entity/Entity";
export class ReceivedAchievement extends Entity {
    public userId: number | undefined;
    public achievementId: number | undefined;
}