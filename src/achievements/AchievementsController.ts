import { WebApi } from "../api/web";
import { CRUDRouter } from "../api/CRUDRouter";
import { AchievementRepository } from "./AchievementRepository";
import { ReceivedAchievementsRepository } from "./ReceivedAchievementsRepository";

class AchievementsControllerClass {
    public Init() {
        const achievementsRouter = new CRUDRouter("achievements", AchievementRepository);
        WebApi.app.use("/api/achievements", achievementsRouter.GetRouter());


        const receivedAchievementsRouter = new CRUDRouter("receivedAchievements", ReceivedAchievementsRepository);
        WebApi.app.use("/api/receivedachievements", receivedAchievementsRouter.GetRouter());
    }

}

export const AchievementsController = new AchievementsControllerClass();
