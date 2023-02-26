import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { ExerciseStep } from "../entities/ExerciseStep";
import { ExerciseRun } from "../entities/ExerciseRun";
import { ConvertAdminQuery } from "../../api/AdminQuery";
import { GroupController } from "./GroupController";
import { UserController } from "../../users/controllers/UserController";

class ExerciseRunControllerClass<T extends Entity> extends EntityFactory<T> {
    public async GetWithUser(userId: number) {
        const entries = await this.Repository().where("user", userId).select();
        return entries;
    }

    public async GetWithUserAndDate(userId: number, startDt: number, endDt: number) {
        const entries = await this.Repository().where("user", userId)
            .andWhere("FINISHED_DT", ">", startDt)
            .andWhere("FINISHED_DT", "<", endDt)
            .select();
        return entries;
    }

    public async GetWithExercise(id: number) {
        const entries = await this.Repository().where("exercise", "LIKE", `%${id}%`).select();
        return entries;
    }

    public async GetWithUserAndExercise(userId: number, exerciseId: number) {
        const entries = await this.Repository().where("user", "LIKE", `%${userId}%`).andWhere("exercise", "LIKE", `%${exerciseId}%`).select();
        if (entries.length) {
            return entries[0];
        }
    }
}

export const RunsRepository = () => Connection<ExerciseRun>("Runs").joinRaw("left join (select `id` as i, `group` from Users) as a on a.i = Runs.user");
export const ExerciseRunController = new ExerciseRunControllerClass<ExerciseRun>(RunsRepository);