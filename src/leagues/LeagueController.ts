import { Connection } from "../Database";
import { EntityFactory } from "../entity/EntityFactory";
import { League } from "./League";

class LeagueControllerClass extends EntityFactory<League> {
}

export const LeaguesRepository = () => Connection<League>("Leagues");
export const LeagueController = new LeagueControllerClass(LeaguesRepository);