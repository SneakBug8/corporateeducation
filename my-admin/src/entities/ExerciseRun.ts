import { Entity } from "../../entity/Entity";
import { MIS_DT } from "../../util/MIS_DT";
export class ExerciseRun extends Entity {

    public userId: number = 0;
    public exerciseId: number = 0;
    public time: number | undefined;
    public experience: number | undefined;
    public data: string | undefined;
    public step: number = 0;
    public finished: boolean = false;
    public FINISHED_DT = 0;
    public RESTART_DT = MIS_DT.GetExact();
    public trynumber: number = 0;
    public mistakes: number = 0;

    public userGroup: number = 0;

}
