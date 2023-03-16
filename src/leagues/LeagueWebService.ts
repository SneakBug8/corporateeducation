import { WebApi } from "../api/web";
import { CRUDRouter } from "../api/CRUDRouter";
import { LeagueController } from "./LeagueController";
import { LeaguesService } from "./LeaguesService";

class LeagueWebServiceClass {
    public Init() {
        const leaguerouter = new CRUDRouter("leagues", LeagueController);
        WebApi.app.use("/api/leagues", leaguerouter.GetRouter());

        WebApi.app.get("/api/leaguestop/:id", async (req, res) => {
            const id = Number.parseInt(req.params.id, 10);
            const data = await LeaguesService.GetLeaderboard(id);
            res.json({id, data});
        });
    }

}

export const LeagueWebService = new LeagueWebServiceClass();
