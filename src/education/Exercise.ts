import { ConvertAdminQuery } from "../api/AdminQuery";
import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class Exercise {
    public id: undefined | number;
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
        const entries = await ExercisesRepository().where("id", "LIKE", `%${id}%`).select();

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

    public static async Delete(id: number)
    {
        await ExercisesRepository().delete().where("id", id);
    }

    public static async Insert(exercise: Exercise) {
        exercise.UPDATED_DT = MIS_DT.GetExact();
        const r = await ExercisesRepository().insert(exercise);

        exercise.id = r[0];
        return exercise;
    }

    public static async Update(exercise: Exercise) {
        exercise.UPDATED_DT = MIS_DT.GetExact();
        await ExercisesRepository().where("id", exercise.id).update(exercise);
        return exercise;
    }

    public static async GetMany(query: any)
    {
        const data = await ConvertAdminQuery(query, ExercisesRepository().select());
        return data;
    }

    public static async Count(): Promise<number>
    {
        const data = await ExercisesRepository().count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
    }
}

export const ExercisesRepository = () => Connection<Exercise>("Exercises");
