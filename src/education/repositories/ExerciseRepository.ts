import { Connection } from "../../Database";
import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Exercise } from "../entities/Exercise";
import { ExerciseDependency } from "../entities/ExerciseDependency";
import { ExerciseDependencyRepository } from "./ExerciseDependencyRepository";

class ExerciseRepositoryClass extends EntityFactory<Exercise> {
    public async GetPreviousIDs(exercise: Exercise) {
        /*if (!exercise.previousexercises) {
            return [];
        }

        const prev = new Array<number>();
        const spl = exercise.previousexercises.split(",");

        for (const s of spl) {
            prev.push(Number.parseInt(s, 10));
        }

        return prev; */

        if (!exercise.id) {
            return [];
        }

        const prevs = await ExerciseDependencyRepository.GetWithExercise(exercise.id);

        const res = [];

        for (const p of prevs) {
            if (p.prevExerciseId) {
                res.push(p.prevExerciseId);
            }
        }

        return res;
    }

    public async Parse(t: Exercise) {
        const prev = await this.GetPreviousIDs(t);
        t.previousexercises = prev.join(",");
        
        return t;
    }

    public async Cleanup(t: Exercise) {
        await this.SetPreviousIDs(t);
        delete t.previousexercises;
        
        return t;
    }

    public async SetPreviousIDs(exercise: Exercise) {
        if (!exercise.id) {
            return [];
        }

        let spl = new Array<number>();

        //console.log(exercise);

        if (typeof exercise.previousexercises === "string") {
            spl = exercise.previousexercises.split(",").map((x) => Number.parseInt(x, 10));
        }

        const allExisting = await ExerciseDependencyRepository.GetWithExercise(exercise.id);

        //console.log(`Want to have dependencies ${JSON.stringify(spl)}`);
        // Remove all extra
        for (const e of allExisting) {
            console.log(e);
            if (!e.id || !e.prevExerciseId) {
                continue;
            }
            if (!spl.includes(e.prevExerciseId)) {
                //console.log(`Deleting dependency between ${e.exerciseId} and ${e.prevExerciseId}`);
                await ExerciseDependencyRepository.Delete(e.id);
            }
        }

        // Add new ones
        for (const s of spl) {
            const existing = await ExerciseDependencyRepository.GetWithExerciseAndPrev(exercise.id, s);

            if (existing) {
                continue;
            }

            const dependency = new ExerciseDependency();
            dependency.exerciseId = exercise.id;
            dependency.prevExerciseId = s;

            //console.log(`Creating dependency between ${dependency.exerciseId} and ${dependency.prevExerciseId}`);

            await ExerciseDependencyRepository.Insert(dependency);
        }
    }

    public async GetByName(name: string) {
        const entries = await this.Repository().where("name", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }
}

const ExercisesConnection = () => Connection<Exercise>("Exercises");
export const ExerciseRepository = new ExerciseRepositoryClass(ExercisesConnection);
