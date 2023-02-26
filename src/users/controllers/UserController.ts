import { Connection } from "../../Database";
import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { ResponseTypes } from "../../web/ResponseTypes";
import { User, UserRole } from "../User";

class UserControllerClass extends EntityFactory<User> {
    public async GetWithGroup(groupid: number) {
        const entries = await this.Repository().where("group", "LIKE", `%${groupid}%`).select();

        return entries;
    }

    public async HasByLogin(name: string) {
        const entries = await this.Repository().where("username", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return true;
        }

        return null;
    }

    public async GetByLogin(name: string) {
        const entries = await this.Repository().where("username", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0];
        }

        return null;
    }

    public async CheckRole(userId: number, role: UserRole) {
        const user = await this.GetById(userId);

        if (!user) {
            return ResponseTypes.NoSuchUser;
        }

        return user.role || UserRole.Student >= role;
    }
}

export const UsersRepository = () => Connection<User>("Users");
export const UserController = new UserControllerClass(UsersRepository);
