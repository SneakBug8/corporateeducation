import { Entity } from "../../entity/Entity";

export class TokenEntry extends Entity {
    userId: number | undefined;
    token: string | undefined;
    liveuntil: number | undefined;
    active: boolean = true;
}
