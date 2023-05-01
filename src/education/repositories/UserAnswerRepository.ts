import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { UserAnswer } from "../entities/UserAnswer";

class UserAnswerRepositoryClass<T extends Entity> extends EntityFactory<T> {
    
    public async GetUnmarked() {
        const entries = await this.Repository().where("marked", `0`).select();
        return entries;
    }

    public  async GetWithUser(userId: number) {
        const entries = await this.Repository().where("user", "LIKE", `%${userId}%`).select();
        return entries;
    }

    public  async GetWithExercise(id: number) {
        const entries = await this.Repository().where("exercise", "LIKE", `%${id}%`).select();
        return entries;
    }

    public  async GetWithUserAndExercise(userId: number, exerciseId: number) {
        const entries = await this.Repository().where("user", "LIKE", `%${userId}%`).andWhere("exercise", "LIKE", `%${exerciseId}%`).select();
        if (entries.length) {
            return entries[0];
        }
    }

    public  async GetExact(userId: number, exerciseId: number, step: number) {
        const entries = await this.Repository().where("user", "LIKE", `%${userId}%`).andWhere("exercise", "LIKE", `%${exerciseId}%`)
        .andWhere("step", step).select();
        if (entries.length) {
            return entries[0] as UserAnswer;
        }
    }
}

const AnswersConnection = () => Connection<UserAnswer>("Answers");
export const UserAnswerRepository = new UserAnswerRepositoryClass<UserAnswer>(AnswersConnection);