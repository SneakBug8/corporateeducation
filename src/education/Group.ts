import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class Group {
    public Id: undefined | number;
    public name: string | undefined;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await GroupsRepository().where("Id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetByName(name: string) {
        const entries = await GroupsRepository().where("name", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetAll() {
        const entries = await GroupsRepository().select();

        return entries;
    }

    public static async Insert(group: Group) {
        group.UPDATED_DT = MIS_DT.GetExact();
        await GroupsRepository().insert(group);
    }

    public static async Update(group: Group) {
        group.UPDATED_DT = MIS_DT.GetExact();
        await GroupsRepository().where("Id", group.Id).update(group);
    }
}

export const GroupsRepository = () => Connection<Group>("Groups");
