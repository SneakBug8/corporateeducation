import { Logger } from "utility/Logger";
import { WebClientUtil } from "./WebClientUtil";
import { User } from "entities/User";

export class WebClient
{
    constructor(clientId: number)
    {
        this.clientId = clientId;
        WebClientUtil.clients.push(this);
    }

    public clientId: number;
    public ip: string;
    public User: User;

    public errorToShow: string = null;
    public infoToShow: string = null;

    public lastAccess: number = Date.now();

    public attach(user: User) {
        this.User = user;
    }
}
