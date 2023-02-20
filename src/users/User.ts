import { ConvertAdminQuery } from "../api/AdminQuery";
import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
import { ResponseTypes } from "../web/ResponseTypes";

export enum UserRole {
    Student, Trainer, Administrator
}
export class User {
    public id: undefined | number;
    public username: string | undefined;
    public password: string | undefined;
    public role: number | undefined = 0;
    public group: number | undefined;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();
    public AUTHORIZED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await UsersRepository().where("id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }

        return null;
    }

    public static async GetWithGroup(groupid: number) {
        const entries = await UsersRepository().where("group", "LIKE", `%${groupid}%`).select();

        return entries;
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
        contact.UPDATED_DT = MIS_DT.GetExact();
        const r = await UsersRepository().insert(contact);
        return r[0];
    }

    public static async Update(contact: User) {
        contact.UPDATED_DT = MIS_DT.GetExact();
        await UsersRepository().where("id", contact.id).update(contact);
    }

    public static async Delete(id: number) {
        await UsersRepository().delete().where("id", id);
    }

    public static async GetMany(query: any) {
        const data = await ConvertAdminQuery(query, UsersRepository().select());
        return data;
    }

    public static async Count(): Promise<number> {
        const data = await UsersRepository().count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
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
