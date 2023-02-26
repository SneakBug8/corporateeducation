import { Entity } from "../../entity/Entity";

export class ExerciseSchedule extends Entity {
    public groupId: number | undefined;
    public exerciseId: number | undefined;
    public startsDt: number | undefined;
    public endsDt: number | undefined;
    public maxTries: number | undefined;
    public minExp: number | undefined;
    public maxExp: number | undefined;
}

