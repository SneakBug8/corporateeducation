import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class ExerciseStep {
    public Id: undefined | number;
    public exercise: number = 0;
    public stepnumber: number = 0;
    public type: string | undefined;
    public content: string | undefined;
    public answer: string | undefined;
    public experience: number = 0;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await ExerciseStepsRepository().where("Id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetWithExercise(exercise: number) {
        const entries = await ExerciseStepsRepository().where("exercise", "LIKE", `%${exercise}%`).select();

        return entries;
    }

    public static async Count(exercise: number): Promise<number> {
        const data = await ExerciseStepsRepository()
            .where("exercise", "LIKE", `%${exercise}%`).count("Id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
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
        await ExerciseStepsRepository().where("Id", step.Id).update(step);
    }
}

export const ExerciseStepsRepository = () => Connection<ExerciseStep>("ExerciseSteps");
