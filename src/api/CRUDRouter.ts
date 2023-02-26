import * as express from "express";

import { Entity } from "../entity/Entity";
import { EntityFactory } from "../entity/EntityFactory";
import { ParseAdminQuery } from "./AdminQuery";
import { IMyRequest } from "./WebClientUtil";

export class CRUDRouter<T extends Entity> {
    public collectionname = "";

    private Controller: EntityFactory<T>;

    public constructor(name: string, controller: EntityFactory<T>) {
        this.collectionname = name;
        this.Controller = controller;
    }
    public GetRouter() {
        const router = express.Router();
        router.get("/:id", this.onXGet.bind(this));
        router.post("", this.onXInsert.bind(this));
        router.put("/:id", this.onXUpdate.bind(this));
        router.delete("/:id", this.onXDelete.bind(this));
        router.all("", this.onGetXs.bind(this));

        return router;
    }

    public async onXGet(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await this.Controller.GetById(id);
        res.json(r);
    }

    public async onXInsert(req: IMyRequest, res: express.Response) {
        const exercise = req.body as T;

        console.log(exercise);

        const r = await this.Controller.Insert(exercise);

        res.json(r);
    }

    public async onXUpdate(req: IMyRequest, res: express.Response) {
        const e = req.body as T;

        if (!e || !e.id) {
            return;
        }

        const r = await this.Controller.Update(e);
        res.json(r);
    }

    public async onXDelete(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await this.Controller.Delete(id);
        res.json({ id: r });
    }

    public async onGetXs(req: IMyRequest, res: express.Response) {
        try {
            const r = await this.Controller.GetMany(req.query);

            const adminquery = ParseAdminQuery(req.query);
            const count = await this.Controller.Count();

            res.header("Content-Range", `${this.collectionname} ${adminquery.from}-${adminquery.to}/${count}`);
            res.json(r);
        }
        catch (e) {
            console.error(e);
        }
    }
}