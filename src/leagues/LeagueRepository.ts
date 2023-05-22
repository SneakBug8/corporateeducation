import { Connection } from "../Database";
import { EntityFactory } from "../entity/EntityFactory";
import { League } from "./League";

class LeagueRepositoryClass extends EntityFactory<League> {
    public async Cleanup(t: League) {
        // Dates passed from admin are in this format
        
        if (t.starts && typeof t.starts === "string"
        && new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}").test(t.starts)) {
            t.starts = new Date(t.starts).getTime();
        }
        if (t.ends && typeof t.ends === "string"
        && new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}").test(t.ends)) {
            t.ends = new Date(t.ends).getTime();
        }
        
        return t;
    }
}

export const LeaguesConnection = () => Connection<League>("Leagues");
export const LeagueRepository = new LeagueRepositoryClass(LeaguesConnection);