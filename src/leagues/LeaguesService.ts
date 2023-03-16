import { ExerciseRunController } from "../education/controllers/ExerciseRunController";
import { UserController } from "../users/controllers/UserController";
import { User } from "../users/User";
import { MIS_DT } from "../util/MIS_DT";
import { ResponseTypes } from "../web/ResponseTypes";
import { WebResponse } from "../web/WebResponse";
import { LeagueController } from "./LeagueController";
import { LeagueRow } from "./LeagueRow";

export class LeaguesService {
    public static async GetLeaderboard(leagueId: number) {
        const league = await LeagueController.GetById(leagueId);

        if (!league) {
            return [];
        }

        if (!league.group) {
            throw new Error("No group defined");
        }

        if (!league.starts) {
            throw new Error("No league start defined");
        }

        if (!league.ends) {
            throw new Error("No league end defined");
        }

        const users = await UserController.GetWithGroup(league.group);
        const experienceRows = new Array<LeagueRow>();

        for (const user of users) {
            if (!user || !user.id || !user.username) {
                continue;
            }

            const eligibleRuns = await ExerciseRunController.GetWithUserAndDate(user.id, league.starts, league.ends);

            const xpsum = eligibleRuns.filter((x) => x.finished)
                .reduce((p, c) => p + (c.experience || 0), 0);

            const lastdt = eligibleRuns.reduce((p, c) => Math.max(p, c.FINISHED_DT), 0);

            experienceRows.push(new LeagueRow(user.id, user.username, xpsum, lastdt));
        }

        return experienceRows
            .sort((a, b) => a.lastFinishedDate - b.lastFinishedDate)
            .sort((a, b) => b.experience - a.experience);
    }

    public static async FinalizeLeague(leagueId: number) {
        const league = await LeagueController.GetById(leagueId);

        if (!league) {
            return new WebResponse(false, ResponseTypes.NoSuchLeague);
        }

        const leaderboard = await this.GetLeaderboard(leagueId);

        if (leaderboard.length) {
            league.winner = leaderboard[0].userId;
        }

        await LeagueController.Update(league);

        return new WebResponse(true, ResponseTypes.OK);
    }

    public static async OpenLeague(leagueId: number) {
        const league = await LeagueController.GetById(leagueId);

        if (!league) {
            return new WebResponse(false, ResponseTypes.NoSuchLeague);
        }

        league.starts = MIS_DT.GetExact();

        await LeagueController.Update(league);

        return new WebResponse(true, ResponseTypes.OK);
    }
}