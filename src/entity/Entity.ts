import { MIS_DT } from "../util/MIS_DT";

export class Entity {
    public id: undefined | number;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();
}