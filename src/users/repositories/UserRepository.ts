import { Connection } from "../../Database";
import { ConvertAdminQuery } from "../../api/AdminQuery";
import { EducationService } from "../../education/EducationService";
import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { ResponseTypes } from "../../web/ResponseTypes";
import { User, UserRole } from "../entities/User";

class UserRepositoryClass extends EntityFactory<User> {
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

    public async GetAll() {
        const entries = await this.Repository().select() as User[];
        /*Connection.raw("Users.*, (runsExperience + answersExperience) as totalExperience"))
        .joinRaw("left join (select userId, sum(experience) as runsExperience from Runs where finished = 1 group by userId) a on a.userId = id")
        .joinRaw("left join (select userId, sum(experience) as answersExperience from Answers where marked = 1 and outdated = 0 group by userId) b on b.userId = id")*/ 

        const t = await Promise.all(entries.map(async (x) => {
            (x as any).totalExperience = await EducationService.GetUserTotalExperience(x.id as any)
            return x;
        }));
        const r = await Promise.all(t.map(async (x) => await this.Parse(x)));

        return r;
    }

    public async GetMany(query: any) {
        const data = await ConvertAdminQuery(query, this.Repository().select()) as User[];

        /*
        Connection.raw("Users.*, (runsExperience + answersExperience) as totalExperience"))
        .joinRaw("left join (select userId, sum(experience) as runsExperience from Runs where finished = 1 group by userId) a on a.userId = id")
        .joinRaw("left join (select userId, sum(experience) as answersExperience from Answers where marked = 1 and outdated = 0 group by userId) b on b.userId = id")
        */
        const t = await Promise.all(data.map(async (x) => {
            (x as any).totalExperience = await EducationService.GetUserTotalExperience(x.id as any)
            return x;
        }));
        const r = await Promise.all(t.map(async (x) => await this.Parse(x)));

        return r;
    }

    public async GetByLogin(name: string) {
        const entries = await this.Repository().where("username", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0] as User;
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

    public async Insert(exercise: User): Promise<User> {
        const r = await super.Insert(exercise);

        if (r.id) {
        EducationService.RecordUserTotalExperience(r.id, "usercreated");
        }

        return r;
    }

    public async Update(exercise: User): Promise<User> {
        const r = await super.Update(exercise);

        if (r.id) {
        EducationService.RecordUserTotalExperience(r.id, "usercreated");
        }

        return r;
    }
}

const UsersConnection = () => Connection<User>("Users");
export const UserRepository = new UserRepositoryClass(UsersConnection);
