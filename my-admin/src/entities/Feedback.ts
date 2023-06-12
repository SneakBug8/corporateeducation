import { Entity } from "../entity/Entity";
export class Feedback extends Entity {
    public rating: number | undefined;
    public usefulMark: number | undefined;
    public promoterScore: number | undefined;
    public userId: number | undefined;
    public exerciseId: number | undefined;
    public comment: string | undefined;
}