import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { ExerciseStep } from "../entities/ExerciseStep";

class ExerciseStepControllerClass extends EntityFactory<ExerciseStep> {
    public Parse(t: ExerciseStep): ExerciseStep {
        if (t._content) {
            t.content = JSON.parse(t._content);
        }
        return t;
    }

    public async GetWithExercise(exercise: number) {
        const entries = await this.Repository().where("exercise", "LIKE", `%${exercise}%`).select();

        return entries;
    }

    public async GetWithExerciseAndNumber(exercise: number, step: number) {
        const entries = await this.Repository().where("exercise", "LIKE", `%${exercise}%`)
            .andWhere("stepnumber", "LIKE", `%${step}%`).select();

        if (entries.length) {
            return entries[0] as ExerciseStep;
        }
    }

    public async CountWithExercise(exercise: number): Promise<number> {
        const data = await this.Repository().where("exercise", exercise).count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
    }
}

export const ExerciseStepsRepository = () => Connection<ExerciseStep>("ExerciseSteps");

export const ExerciseStepController = new ExerciseStepControllerClass(ExerciseStepsRepository);