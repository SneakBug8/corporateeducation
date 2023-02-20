import { Connection } from "../Database";
import { MIS_DT } from "../util/MIS_DT";
export class League {
    public id: undefined | number;
    public name: string | undefined;
    public group: number | undefined;
    public starts: number | undefined;
    public ends: number | undefined;
    public winner: number | undefined;
    public MIS_DT = MIS_DT.GetExact();
    public UPDATED_DT = MIS_DT.GetExact();

    public static async GetById(id: number) {
        const entries = await LeaguesRepository().where("id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetByName(name: string) {
        const entries = await LeaguesRepository().where("name", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return entries[0];
        }
    }

    public static async GetAll() {
        const entries = await LeaguesRepository().select();

        return entries;
    }

    public static async Insert(league: League) {
        league.UPDATED_DT = MIS_DT.GetExact();

        const r = await LeaguesRepository().insert(league);
        return r[0];
    }

    public static async Update(league: League) {
        league.UPDATED_DT = MIS_DT.GetExact();
        await LeaguesRepository().where("id", league.id).update(league);
    }
}

export const LeaguesRepository = () => Connection<League>("Leagues");
