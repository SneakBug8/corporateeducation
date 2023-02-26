import { WebApi } from "../api/web";
import * as express from "express";
import { Logger } from "winston";
import { IMyRequest } from "../api/WebClientUtil";
import { ParseAdminQuery } from "../api/AdminQuery";
import { User } from "./User";
import { UserController } from "./controllers/UserController";

class UsersWebServiceClass {
    public Init() {
        WebApi.app.get("/api/users/:id", this.onUserGet);
        WebApi.app.post("/api/users", this.onUserInsert);
        WebApi.app.put("/api/users/:id", this.onUserUpdate);
        WebApi.app.delete("/api/users/:id", this.onUserDelete);
        WebApi.app.all("/api/users", this.onGetUsers);
    }

    public async onUserGet(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await UserController.GetById(id);

        if (r) {
            r.password = "";
        }

        res.json(r);
    }

    public async onUserInsert(req: IMyRequest, res: express.Response) {
        const exercise = req.body as User;

        const r = await UserController.Insert(exercise);

        res.json(r);
    }

    public async onUserUpdate(req: IMyRequest, res: express.Response) {
        const t = req.body as User;

        if (!t || !t.id) {
            return;
        }

        if (t.password) {
            const r = await UserController.GetById(t.id);
            t.password = r?.password;
        }

        const r = await UserController.Update(t);
        res.json(r);
    }

    public async onUserDelete(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await UserController.Delete(id);
        res.json({ id: r });
    }

    public async onGetUsers(req: IMyRequest, res: express.Response) {
        try {
            const r = await UserController.GetMany(req.query) as User[];

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
