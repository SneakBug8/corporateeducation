import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class ExerciseSchedule {
    public id: undefined | number;
    public groupId: number | undefined;
    public exerciseId: number | undefined;
    public startsDt: number | undefined;
    public endsDt: number | undefined;
    public maxTries: number | undefined;
    public minExp: number | undefined;
    public maxExp: number | undefined;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await ExerciseSchedulesRepository().where("id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetWithExercise(exercise: number) {
        const entries = await ExerciseSchedulesRepository().where("exerciseId", "LIKE", `%${exercise}%`).select();

        return entries;
    }

    public static async GetWithExerciseAndGroup(exercise: number, group: number) {
        const entry = await ExerciseSchedulesRepository().where("exerciseId", exercise)
        .andWhere("groupId", group)
        .first();

        return entry;
    }

    public static async Count(exercise: number): Promise<number> {
        const data = await ExerciseSchedulesRepository()
            .where("exerciseId", "LIKE", `%${exercise}%`).count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
    }

    public static async GetAll() {
        const entries = await ExerciseSchedulesRepository().select();

        return entries;
    }

    public static async Insert(step: ExerciseSchedule) {
        step.UPDATED_DT = MIS_DT.GetExact();
        await ExerciseSchedulesRepository().insert(step);
    }

    public static async Update(step: ExerciseSchedule) {
        step.UPDATED_DT = MIS_DT.GetExact();
        await ExerciseSchedulesRepository().where("id", step.id).update(step);
    }

    public static async Delete(step: ExerciseSchedule) {
        await ExerciseSchedulesRepository().where("id", step.id).delete();
    }
}

export const ExerciseSchedulesRepository = () => Connection<ExerciseSchedule>("ExerciseSchedules");
