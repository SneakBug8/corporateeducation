import { Connection } from "../Database";
import { Entity } from "../entity/Entity";
import { MIS_DT } from "../util/MIS_DT";
export class League extends Entity {
    public name: string | undefined;
    public group: number | undefined;
    public starts: number | undefined;
    public ends: number | undefined;
    public winner: number | undefined;
}