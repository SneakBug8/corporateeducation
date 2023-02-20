import { ConvertAdminQuery } from "../api/AdminQuery";
import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class ExerciseStep {
    public id: undefined | number;
    public exercise: number = 0;
    public stepnumber: number = 0;
    public type: string | undefined;
    public content: string | undefined;
    public answer: string | undefined;
    public experience: number = 0;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await ExerciseStepsRepository().where("id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetWithExercise(exercise: number) {
        const entries = await ExerciseStepsRepository().where("exercise", "LIKE", `%${exercise}%`).select();

        return entries;
    }

    public static async GetWithExerciseAndNumber(exercise: number, step: number) {
        const entries = await ExerciseStepsRepository().where("exercise", "LIKE", `%${exercise}%`)
            .andWhere("stepnumber", "LIKE", `%${step}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetAll() {
        const entries = await ExerciseStepsRepository().select();

        return entries;
    }

    public static async Insert(step: ExerciseStep) {
        step.UPDATED_DT = MIS_DT.GetExact();
        await ExerciseStepsRepository().insert(step);
    }

    public static async Update(step: ExerciseStep) {
        step.UPDATED_DT = MIS_DT.GetExact();
        await ExerciseStepsRepository().where("id", step.id).update(step);
    }

    public static async Delete(id: number) {
        await ExerciseStepsRepository().delete().where("id", id);
    }

    public static async GetMany(query: any) {
        const data = await ConvertAdminQuery(query, ExerciseStepsRepository().select());
        return data;
    }

    public static async Count(): Promise<number> {
        const data = await ExerciseStepsRepository().count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
    }

    public static async CountWithExercise(exercise: number): Promise<number> {
        const data = await ExerciseStepsRepository().where("exercise", exercise).count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
    }
}

export const ExerciseStepsRepository = () => Connection<ExerciseStep>("ExerciseSteps");
