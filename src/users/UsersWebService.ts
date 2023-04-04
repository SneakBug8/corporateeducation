import { WebApi } from "../api/web";
import * as express from "express";
import { Logger } from "winston";
import { ParseAdminQuery } from "../api/AdminQuery";
import { User } from "./User";
import { UserController } from "./controllers/UserController";
import { WebResponse } from "../web/WebResponse";
import { ResponseTypes } from "../web/ResponseTypes";
import { AuthService } from "./AuthService";
import { ToMD5 } from "../util/ToMd5";

class UsersWebServiceClass {
    public Init() {
        WebApi.app.get("/api/auth", this.onAuth);

        WebApi.app.get("/api/users/:id", this.onUserGet);
        WebApi.app.post("/api/users", this.onUserInsert);
        WebApi.app.put("/api/users/:id", this.onUserUpdate);
        WebApi.app.delete("/api/users/:id", this.onUserDelete);
        WebApi.app.all("/api/users", this.onGetUsers);
    }

    public async onAuth(req: express.Request, res: express.Response) {
        const data = req.body;
        const login = data.login;
        const password = data.password;

        if (!login || !password) {
            return res.json(new WebResponse(false, ResponseTypes.WrongRequestSignature).copy());
        }

        const r = await AuthService.TryAuthWeb(login, password);

        if (!r) {
            return res.json(new WebResponse(false, ResponseTypes.WrongLoginOrPassword).copy());
        }

        const token = await AuthService.CreateToken(login);

        const resdata = new WebResponse(true, ResponseTypes.OK).SetData({token});

        res.json(resdata.copy());
    }

    public async onUserGet(req: express.Request, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await UserController.GetById(id);

        if (r) {
            r.password = "";
        }

        res.json(r);
    }

    public async onUserInsert(req: express.Request, res: express.Response) {
        const exercise = req.body as User;

        const r = await UserController.Insert(exercise);

        res.json(r);
    }

    public async onUserUpdate(req: express.Request, res: express.Response) {
        const t = req.body as User;

        if (!t || !t.id) {
            return;
        }

        if (!t.password) {
            t.password = undefined;
        }

        const r = await UserController.Update(t);
        res.json(r);
    }

    public async onUserDelete(req: express.Request, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await UserController.Delete(id);
        res.json({ id: r });
    }

    public async onGetUsers(req: express.Request, res: express.Response) {
        try {
            const r = await UserController.GetMany(req.query);

            const adminquery = ParseAdminQuery(req.query);
            const count = await UserController.Count();

            if (r) {
                r.forEach((x) => x.password = "");
            }

            res.header("Content-Range", `users ${adminquery.from}-${adminquery.to}/${count}`);
            res.json(r);
        }
        catch (e) {
            console.error(e);
            res.json([]);
        }
    }

}

export const UsersWebService = new UsersWebServiceClass();
