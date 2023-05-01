import { WebApi } from "../api/web";
import { CRUDRouter } from "../api/CRUDRouter";
import { LeagueRepository } from "./LeagueRepository";
import { LeaguesService } from "./LeaguesService";

class LeagueControllerClass {
    public Init() {
        const leaguerouter = new CRUDRouter("leagues", LeagueRepository);
        WebApi.app.use("/api/leagues", leaguerouter.GetRouter());

        WebApi.app.get("/api/leaguestop/:id", async (req, res) => {
            const id = Number.parseInt(req.params.id, 10);
            const data = await LeaguesService.GetLeaderboard(id);
            res.json({id, data});
        });
    }

}

export const LeagueController = new LeagueControllerClass();
