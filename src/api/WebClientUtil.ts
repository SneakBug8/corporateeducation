import { WebClient } from "./WebClient";
import * as express from "express";
import { Logger } from "utility/Logger";
import { asyncForEach } from "utility/asyncForEach";

export class WebClientUtil
{
    public static clients: WebClient[] = [];

    public static async LoadClient(req: IMyRequest, res: express.Response, next: () => void)
    {
        let client = WebClientUtil.clients.find((x) => req.ip === x.ip);

        if (!client) {
           client = new WebClient(Math.round(Math.random() * 100000));
        }

        req.client = client;
        next();
    }
}

export interface IMyRequest extends express.Request
{
    client?: WebClient;
    id?: number;
}
