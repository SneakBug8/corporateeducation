import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
import { ResponseTypes } from "../web/ResponseTypes";

export enum UserRole {
    Student, Trainer, Administrator
}
export class User {
    public Id: undefined | number;
    public username: string | undefined;
    public password: string | undefined;
    public role: number | undefined = 0;
    public group: number | undefined;
    public MIS_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await UsersRepository().where("Id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }

        return null;
    }

    public static async HasByLogin(name: string) {
        const entries = await UsersRepository().where("username", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return true;
        }

        return null;
    }

    public static async GetByLogin(name: string) {
        const entries = await UsersRepository().where("username", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0];
        }

        return null;
    }

    public static async GetAll() {
        const entries = await UsersRepository().select();

        return entries;
    }

    public static async Insert(contact: User) {
        const r = await UsersRepository().insert(contact);
        return r[0];
    }

    public static async Update(contact: User) {
        await UsersRepository().where("Id", contact.Id).update(contact);
    }

    public static async Delete(contactId: number) {
        await UsersRepository().where("Id", contactId).delete();
    }

    public static async CheckRole(userId: number, role: UserRole) {
        const user = await this.GetById(userId);

        if (!user) {
            return ResponseTypes.NoSuchUser;
        }

        return user.role || UserRole.Student >= role;
    }
}

export const UsersRepository = () => Connection<User>("Users");
