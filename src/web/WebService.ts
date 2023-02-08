import { WebApi } from "../api/web";
import * as express from "express";
import { AuthService } from "../users/AuthService";
import { User, UserRole } from "../users/User";
import { ResponseTypes } from "./ResponseTypes";

class WebServiceClass
{
    private async GetUser(req: express.Request, res: express.Response)
    {
        const token = req.cookies.token;

        return AuthService.RetrieveByToken(token);
    }

    private async CheckRole(req: express.Request, res: express.Response, role: UserRole)
    {
        const user = await this.GetUser(req, res);

        if (!user || !user.Id) {
            return ResponseTypes.NotAuthorized;
        }

        const r = await User.CheckRole(user.Id, role);

        return r;
    }
}

export const WebService = new WebServiceClass();
