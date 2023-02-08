import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class ExerciseRun {
    public Id: number | undefined;
    public user: number = 0;
    public exercise: number = 0;
    public time: number | undefined;
    public experience: number | undefined;
    public data: string | undefined;
    public step: number = 0;
    public finished: boolean = false;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await RunsRepository().where("Id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetWithUser(userId: number) {
        const entries = await RunsRepository().where("user", "LIKE", `%${userId}%`).select();
        return entries;
    }

    public static async GetWithExercise(id: number) {
        const entries = await RunsRepository().where("exercise", "LIKE", `%${id}%`).select();
        return entries;
    }

    public static async GetWithUserAndExercise(userId: number, exerciseId: number) {
        const entries = await RunsRepository().where("user", "LIKE", `%${userId}%`).andWhere("exercise", "LIKE", `%${exerciseId}%`).select();
        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetAll() {
        const entries = await RunsRepository().select();

        return entries;
    }

    public static async Insert(run: ExerciseRun) {
        run.UPDATED_DT = MIS_DT.GetExact();
        await RunsRepository().insert(run);
    }

    public static async Update(run: ExerciseRun) {
        run.UPDATED_DT = MIS_DT.GetExact();
        await RunsRepository().where("Id", run.Id).update(run);
    }
}

export const RunsRepository = () => Connection<ExerciseRun>("Runs");
