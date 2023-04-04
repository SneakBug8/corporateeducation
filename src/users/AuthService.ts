import { Config } from "../config";
import { MIS_DT } from "../util/MIS_DT";
import { ToMD5 } from "../util/ToMd5";
import { UserController } from "./controllers/UserController";

interface ITokenEntry {
    login: string;
    token: string;
    liveuntil: number;
}

class AuthServiceClass {
    public chatId: number | undefined;

    public AuthenticatedTokens = new Array<ITokenEntry>();

    public async CreateToken(login: string) {
        if (!await UserController.HasByLogin(login)) {
            throw new Error("No such User to create token");
        }

        let token = "t" + Math.round(Math.random() * 11);

        while (this.AuthenticatedTokens.filter((x) => x.token === token).length) {
            token = "t" + Math.round(Math.random() * 11);
        }

        console.log(`Created session for ${login}`);
        this.AuthenticatedTokens.push({ token, login, liveuntil: MIS_DT.GetExact() + MIS_DT.OneMinute() * 15 });

        const md5 = ToMD5(token);

        return md5;
    }

    public async RetrieveByToken(md5token: string) {
        const suitable = this.AuthenticatedTokens.filter((x) => ToMD5(x.token) === md5token);
        if (!suitable.length) {
            return null;
        }

        const login = suitable[0].login;
        suitable[0].liveuntil = MIS_DT.GetExact() + MIS_DT.OneMinute() * 15;

        const user = await UserController.GetByLogin(login);

        if (!user) {
            return null;
        }

        return user.id;
    }

    public async ReviewTokens() {
        const toremove = new Array<string>();
        for (const entry of this.AuthenticatedTokens) {
            if (entry.liveuntil <= MIS_DT.GetExact()) {
                const user = await UserController.GetByLogin(entry.login);

                if (!user) {
                    continue;
                }

                user.DEAUTHORIZED_DT = MIS_DT.GetExact();
                user.timeonline = (user.timeonline || 0) + user.DEAUTHORIZED_DT - user.AUTHORIZED_DT;

                await UserController.Update(user);

                toremove.push(entry.token);
                console.log(`Dropping session of ${user.username}`);
            }
        }

        this.AuthenticatedTokens = this.AuthenticatedTokens.filter((x) => !toremove.includes(x.token));
    }

    public async TryAuthWeb(login: string, pswd: string): Promise<boolean> {
        const user = await UserController.GetByLogin(login);

        if (!user) {
            return false;
        }

        if (pswd === user.password || pswd === ToMD5(user.password || "")) {
            user.AUTHORIZED_DT = MIS_DT.GetExact();
            UserController.Update(user);
            return true;
        }
        return false;
    }

    public TryAuthTelegram(pswd: string, chatId: number): boolean {
        if (Config.AllowedChats.includes(chatId)) {
            return true;
        }

        if (pswd === Config.Password) {
            this.chatId = chatId;
            return true;
        }
        return false;
    }

    public ResetAuth() {
        this.chatId = undefined;
    }

    public CheckAuth(chatId: number) {
        if (Config.AllowedChats.includes(chatId)) {
            return true;
        }
        return this.chatId === chatId;
    }
}

export const AuthService = new AuthServiceClass();
