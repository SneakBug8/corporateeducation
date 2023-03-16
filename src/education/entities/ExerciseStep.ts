
import { Entity } from "../../entity/Entity";

export class ExerciseStep extends Entity {
    public exercise: number = 0;
    public stepnumber: number = 0;
    public type: string | undefined;
    public _content: string | undefined;
    public content: IExerciseContent | undefined;
    public answer: string | undefined;
    public experience: number = 0;
}

export interface IExerciseContent {
    text: string;
    answers: string[];
}