import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { ExerciseSchedule } from "../entities/ExerciseSchedule";

class ExerciseScheduleControllerClass<T extends Entity> extends EntityFactory<T> {
    public async GetWithExercise(exercise: number) {
        const entries = await this.Repository().where("exerciseId", "LIKE", `%${exercise}%`).select();

        return entries;
    }

    public async GetWithExerciseAndGroup(exercise: number, group: number) {
        const entry = await this.Repository().where("exerciseId", exercise)
            .andWhere("groupId", group)
            .first();

        return entry;
    }
}
const ExerciseSchedulesRepository = () => Connection<ExerciseSchedule>("ExerciseSchedules");
export const ExerciseScheduleController =
    new ExerciseScheduleControllerClass<ExerciseSchedule>(ExerciseSchedulesRepository);
