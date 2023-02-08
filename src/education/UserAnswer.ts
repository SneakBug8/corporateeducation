import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class UserAnswer {
    public Id: number | undefined;
    public user: number = 0;
    public exercise: number = 0;
    public experience: number | undefined = 0;
    public marked: boolean = false;
    public step: number = 0;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await AnswersRepository().where("Id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetUnmarked() {
        const entries = await AnswersRepository().where("marked", `0`).select();
        return entries;
    }

    public static async GetWithUser(userId: number) {
        const entries = await AnswersRepository().where("user", "LIKE", `%${userId}%`).select();
        return entries;
    }

    public static async GetWithExercise(id: number) {
        const entries = await AnswersRepository().where("exercise", "LIKE", `%${id}%`).select();
        return entries;
    }

    public static async GetWithUserAndExercise(userId: number, exerciseId: number) {
        const entries = await AnswersRepository().where("user", "LIKE", `%${userId}%`).andWhere("exercise", "LIKE", `%${exerciseId}%`).select();
        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetExact(userId: number, exerciseId: number, step: number) {
        const entries = await AnswersRepository().where("user", "LIKE", `%${userId}%`).andWhere("exercise", "LIKE", `%${exerciseId}%`)
        .andWhere("step", step).select();
        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetAll() {
        const entries = await AnswersRepository().select();

        return entries;
    }

    public static async Insert(run: UserAnswer) {
        run.UPDATED_DT = MIS_DT.GetExact();
        await AnswersRepository().insert(run);
    }

    public static async Update(run: UserAnswer) {
        run.UPDATED_DT = MIS_DT.GetExact();
        await AnswersRepository().where("Id", run.Id).update(run);
    }
}

export const AnswersRepository = () => Connection<UserAnswer>("Answers");
