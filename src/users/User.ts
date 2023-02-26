import { ConvertAdminQuery } from "../api/AdminQuery";
import { Connection } from "../Database";
import { Entity } from "../entity/Entity";
import { MIS_DT } from "../util/MIS_DT";
import { ResponseTypes } from "../web/ResponseTypes";

export enum UserRole {
    Student, Trainer, Administrator
}
export class User extends Entity {
    public username: string | undefined;
    public password: string | undefined;
    public role: number | undefined = 0;
    public group: number | undefined;
    public AUTHORIZED_DT = MIS_DT.GetExact();
}

