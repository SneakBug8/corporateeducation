import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { UserAnswer } from "../entities/UserAnswer";
import { EducationService } from "../EducationService";

class UserAnswerRepositoryClass extends EntityFactory<UserAnswer> {
    
    public async GetUnmarked() {
        const entries = await this.Repository().where("marked", `0`).select();
        return entries as UserAnswer[];
    }

    public async GetWithUser(userId: number) {
        const entries = await this.Repository().where("userId", userId).select();
        return entries as UserAnswer[];
    }

    public async GetWithExercise(id: number) {
        const entries = await this.Repository().where("exerciseId", id).select();
        return entries as UserAnswer[];
    }

    public  async GetWithUserAndExercise(userId: number, exerciseId: number) {
        const entries = await this.Repository().where("userId", userId).andWhere("exercise", exerciseId).select();
        if (entries.length) {
            return entries[0] as UserAnswer;
        }
    }

    public  async GetExact(userId: number, exerciseId: number, step: number) {
        const entries = await this.Repository().where("userId", userId).andWhere("exercise", exerciseId)
        .andWhere("step", step).select();
        if (entries.length) {
            return entries[0] as UserAnswer;
        }
    }

    public async Insert(exercise: UserAnswer): Promise<UserAnswer> {
        const r = await super.Insert(exercise);

        EducationService.RecordUserTotalExperience(exercise.userId, "answer");

        return r;
    }

    public async Update(exercise: UserAnswer): Promise<UserAnswer> {
        const r = await super.Update(exercise);

        EducationService.RecordUserTotalExperience(exercise.userId, "answer");

        return r;
    }
}

const AnswersConnection = () => Connection<UserAnswer>("Answers");
export const UserAnswerRepository = new UserAnswerRepositoryClass(AnswersConnection);