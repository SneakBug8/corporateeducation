import { Connection } from "../Database";
import { EntityFactory } from "../entity/EntityFactory";
import { League } from "./League";

class LeagueRepositoryClass extends EntityFactory<League> {
}

export const LeaguesConnection = () => Connection<League>("Leagues");
export const LeagueRepository = new LeagueRepositoryClass(LeaguesConnection);