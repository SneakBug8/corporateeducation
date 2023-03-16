import { Entity } from "./Entity";

export enum UserRole {
    Student, Trainer, Administrator
}
export class User extends Entity {
    public username: string | undefined;
    public password: string | undefined;
    public role: number | undefined = 0;
    public group: number | undefined;
    public AUTHORIZED_DT = 0;
}
