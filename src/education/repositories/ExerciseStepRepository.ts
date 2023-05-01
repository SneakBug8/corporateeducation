import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { ExerciseStep } from "../entities/ExerciseStep";

class ExerciseStepRepositoryClass extends EntityFactory<ExerciseStep> {
    public async Parse(t: ExerciseStep) {
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

const ExerciseStepsConnection = () => Connection<ExerciseStep>("ExerciseSteps");

export const ExerciseStepRepository = new ExerciseStepRepositoryClass(ExerciseStepsConnection);