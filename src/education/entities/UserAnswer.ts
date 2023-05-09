import { Entity } from "../../entity/Entity";
export class UserAnswer extends Entity {
    public user: number = 0;
    public exercise: number = 0;
    public experience: number | undefined = 0;
    public maxexperience: number | undefined = 0;

    public answer: string = "";

    public marked: boolean = false;
    public step: number = 0;

}

