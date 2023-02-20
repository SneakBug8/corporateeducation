import { ConvertAdminQuery } from "../api/AdminQuery";
import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class ExerciseRun {
    public id: number | undefined;
    public user: number = 0;
    public exercise: number = 0;
    public time: number | undefined;
    public experience: number | undefined;
    public data: string | undefined;
    public step: number = 0;
    public finished: boolean = false;
    public FINISHED_DT = 0;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await RunsRepository().where("id", id).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetWithUser(userId: number) {
        const entries = await RunsRepository().where("user", userId).select();
        return entries;
    }

    public static async GetWithUserAndDate(userId: number, startDt: number, endDt: number) {
        const entries = await RunsRepository().where("user", userId)
        .andWhere("FINISHED_DT", ">", startDt)
        .andWhere("FINISHED_DT", "<", endDt)
        .select();
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
        await RunsRepository().where("id", run.id).update(run);
    }

    public static async Delete(id: number) {
        await RunsRepository().delete().where("id", id);
    }

    public static async GetMany(query: any) {
        const data = await ConvertAdminQuery(query, RunsRepository().select());
        return data;
    }

    public static async Count(): Promise<number> {
        const data = await RunsRepository().count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
    }
}

export const RunsRepository = () => Connection<ExerciseRun>("Runs");
