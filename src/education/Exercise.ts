import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class Exercise {
    public Id: undefined | number;
    public name: string | undefined;
    public previousexercises: string | undefined;
    public public: boolean = true;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetPreviousIDs(exercise: Exercise) {
        if (!exercise.previousexercises) {
            return [];
        }

        const prev = new Array<number>();
        const spl = exercise.previousexercises.split(",");

        for (const s of spl) {
            prev.push(Number.parseInt(s, 10));
        }

        return prev;
    }

    public static async GetById(id: number) {
        const entries = await ExercisesRepository().where("Id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetByName(name: string) {
        const entries = await ExercisesRepository().where("name", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetAll() {
        const entries = await ExercisesRepository().select();

        return entries;
    }

    public static async Insert(exercise: Exercise) {
        exercise.UPDATED_DT = MIS_DT.GetExact();
        await ExercisesRepository().insert(exercise);
    }

    public static async Update(exercise: Exercise) {
        exercise.UPDATED_DT = MIS_DT.GetExact();
        await ExercisesRepository().where("Id", exercise.Id).update(exercise);
    }
}

export const ExercisesRepository = () => Connection<Exercise>("Exercises");
