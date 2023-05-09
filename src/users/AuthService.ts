import { Config } from "../config";
import { MIS_DT } from "../util/MIS_DT";
import { ToMD5 } from "../util/ToMd5";
import { ResponseTypes } from "../web/ResponseTypes";
import { WebResponse } from "../web/WebResponse";
import { UserRepository } from "./repositories/UserRepository";

interface ITokenEntry {
    login: string;
    token: string;
    liveuntil: number;
}

class AuthServiceClass {
    public chatId: number | undefined;

    public AuthenticatedTokens = new Array<ITokenEntry>();

    public constructor() {
        if (Config.isDev()) {
            console.log(`Adding test token due to dev environment`);

            this.AuthenticatedTokens.push({
                login: "test83",
                token: "entirelysecrettoken",
                liveuntil: MIS_DT.GetExact() + MIS_DT.OneDay()
            })
        }
    }

    public async CreateToken(login: string) {
        if (!await UserRepository.HasByLogin(login)) {
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
        const suitable = this.AuthenticatedTokens.filter((x) => ToMD5(x.token) === md5token || (Config.isDev() && x.token === md5token));
        if (!suitable.length) {
            return null;
        }

        const login = suitable[0].login;
        suitable[0].liveuntil = MIS_DT.GetExact() + MIS_DT.OneMinute() * 15;

        const user = await UserRepository.GetByLogin(login);

        if (!user) {
            return null;
        }

        return user;
    }

    public async ReviewTokens() {
        const toremove = new Array<string>();
        for (const entry of this.AuthenticatedTokens) {
            if (entry.liveuntil <= MIS_DT.GetExact()) {
                const user = await UserRepository.GetByLogin(entry.login);

                if (!user) {
                    continue;
                }

                user.DEAUTHORIZED_DT = MIS_DT.GetExact();
                user.timeonline = (user.timeonline || 0) + user.DEAUTHORIZED_DT - user.AUTHORIZED_DT;

                await UserRepository.Update(user);

                toremove.push(entry.token);
                console.log(`Dropping session of ${user.username}`);
            }
        }

        this.AuthenticatedTokens = this.AuthenticatedTokens.filter((x) => !toremove.includes(x.token));
    }

    public async TryAuthWeb(login: string, pswd: string) {
        const user = await UserRepository.GetByLogin(login);

        if (!user) {
            return new WebResponse(false, ResponseTypes.WrongLoginOrPassword);
        }

        if (user.blocked) {
            return new WebResponse(false, ResponseTypes.BlockedByAdmin);
        }

        if (pswd === user.password || pswd === ToMD5(user.password || "")) {
            user.AUTHORIZED_DT = MIS_DT.GetExact();
            UserRepository.Update(user);
            return new WebResponse(true, ResponseTypes.OK);
        }
        return new WebResponse(false, ResponseTypes.WrongLoginOrPassword);
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
