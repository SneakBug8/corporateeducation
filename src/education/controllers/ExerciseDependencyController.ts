import { Connection } from "../../Database";
import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Exercise } from "../entities/Exercise";
import { ExerciseDependency } from "../entities/ExerciseDependency";


class ExerciseDependencyControllerClass<T extends Entity> extends EntityFactory<T> {
    
    public async GetWithExercise(exerciseId: number) {
        const entries = await this.Repository().where("exerciseId", exerciseId).select();
        return entries as ExerciseDependency[];
    }

    public async GetWithExerciseAndPrev(exerciseId: number, prevId: number) {
        const entry = await this.Repository().where("exerciseId", exerciseId)
        .andWhere("prevExerciseId", prevId).first();

        return entry as ExerciseDependency;
    }
}


const repository = () => Connection<ExerciseDependency>("ExerciseDependencies");
export const ExerciseDependencyController = new ExerciseDependencyControllerClass<ExerciseDependency>(repository);
