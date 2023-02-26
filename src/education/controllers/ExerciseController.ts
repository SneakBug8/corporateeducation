import { Connection } from "../../Database";
import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Exercise } from "../entities/Exercise";
import { ExerciseStep } from "../entities/ExerciseStep";

class ExerciseControllerClass<T extends Entity> extends EntityFactory<T> {
    public async GetPreviousIDs(exercise: Exercise) {
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

    public async GetByName(name: string) {
        const entries = await this.Repository().where("name", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }
}

export const ExercisesRepository = () => Connection<Exercise>("Exercises");
export const ExerciseController = new ExerciseControllerClass<Exercise>(ExercisesRepository);
