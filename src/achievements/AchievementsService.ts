import { EducationService } from "../education/EducationService";
import { ExerciseRun } from "../education/entities/ExerciseRun";
import { ReceivedAchievement } from "./ReceivedAchievement";
import { ReceivedAchievementsRepository } from "./ReceivedAchievementsRepository";

class AchievementsServiceClass {
    public Init() {
        EducationService.OnTaskFinished.Subscribe(this.OnTaskFinished.bind(this));
    }

    private async OnTaskFinished(run: ExerciseRun) {
        if (run.exerciseId === 1) {
            this.GiveAchievement(run.userId, 1);
        }
        if (run.exerciseId === 2) {
            this.GiveAchievement(run.userId, 6);
        }
        // Non-blocking event
        return false;
    }

    private async GiveAchievement(userId: number, achievementId: number) {
        const prevach = await ReceivedAchievementsRepository.GetAchievement(userId, achievementId);

        if (prevach) {
            return false;
        }

        const ach = new ReceivedAchievement();
        ach.achievementId = achievementId;
        ach.userId = userId;

        await ReceivedAchievementsRepository.Insert(ach);

        console.log(`Achievement ${achievementId} given to ${userId}`);
        return true;
    }
}

export const AchievementsService = new AchievementsServiceClass();