import { Entity } from "../../entity/Entity";
import { MIS_DT } from "../../util/MIS_DT";
export class UserExperienceHistory extends Entity {
    public userId: number = 0;
    public runsExperience: number = 0;
    public answersExperience: number = 0;
    public totalExperience: number = 0;
    public source: string | undefined;
}
