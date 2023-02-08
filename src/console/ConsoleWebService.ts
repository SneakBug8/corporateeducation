import { WebApi } from "../api/web";
import * as express from "express";

class ConsoleWebServiceClass
{
    public Init()
    {
        WebApi.app.get("/console", this.OnOpen);
        WebApi.app.post("/api/console", this.OnPass);
    }

    private async OnOpen(req: express.Request, res: express.Response)
    {
        res.render("console");
    }

    private async OnPass(req: express.Request, res: express.Response)
    {
        const data = req.body.data;
        const command = data.command;

        console.log(data);
        console.log(command);

        let response = "Unknown command";

        if (command === "ping") {
            response = "pong";
        }

        res.json({response});
    }
}

export const ConsoleWebService = new ConsoleWebServiceClass();
