import { Entity } from "../../entity/Entity";
export class ExerciseRun extends Entity {

    public user: number = 0;
    public exercise: number = 0;
    public time: number | undefined;
    public experience: number | undefined;
    public data: string | undefined;
    public step: number = 0;
    public finished: boolean = false;
    public FINISHED_DT = 0;

}