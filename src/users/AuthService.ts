import { Config } from "../config";
import { MIS_DT } from "../util/MIS_DT";
import { ToMD5 } from "../util/ToMd5";
import { ResponseTypes } from "../web/ResponseTypes";
import { WebResponse } from "../web/WebResponse";
import { TokenEntry } from "./entities/TokenEntry";
import { User } from "./entities/User";
import { UserRepository } from "./repositories/UserRepository";
import { UserTokenRepository } from "./repositories/UserTokenRepository";

class AuthServiceClass {
    public chatId: number | undefined;

    public AuthenticatedTokens = new Array<TokenEntry>();

    public constructor() {
        if (Config.isDev()) {
            this.setDevTokens();
        }
    }

    private async setDevTokens() {
        console.log(`Adding test token due to dev environment`);

        for (let i = 1; i <= 10; i++) {

            const ent = await UserTokenRepository.GetWithToken("entirelysecrettoken" + i);

            if (ent) {
                ent.liveuntil = MIS_DT.GetExact() + MIS_DT.OneDay();

                UserTokenRepository.Update(ent);
            }
            else {
                const token = new TokenEntry();
                token.userId = i;
                token.token = "entirelysecrettoken" + i

                UserTokenRepository.Insert(token);
            }
        }
    }

    public async CreateToken(userId: number) {
        if (!await UserRepository.GetById(userId)) {
            throw new Error("No such User to create token");
        }

        let token = "t" + Math.round(Math.random() * 100);

        while (await UserTokenRepository.GetActiveWithToken(ToMD5(token))) {
            token = "t" + Math.round(Math.random() * 99999);
        }

        console.log(`Created session for ${userId}`);

        const obj = new TokenEntry();
        obj.userId = userId;
        obj.token = ToMD5(token);
        obj.liveuntil = MIS_DT.GetExact() + MIS_DT.OneMinute() * 15;

        await UserTokenRepository.Insert(obj);

        const md5 = ToMD5(token);

        return md5;
    }

    public async RetrieveByToken(md5token: string) {
        const suitable = await UserTokenRepository.GetActiveWithToken(md5token);

        if (!suitable || !suitable.userId) {
            return;
        }

        const userId = suitable.userId;
        suitable.liveuntil = MIS_DT.GetExact() + MIS_DT.OneMinute() * 15;
        UserTokenRepository.Update(suitable);

        const user = await UserRepository.GetById(userId);

        if (!user) {
            return null;
        }

        return user;
    }

    public async ReviewTokens() {
        const tokens = await UserTokenRepository.GetActive();

        tokens.forEach(async (entry) => {
            if (!entry.id) {
                return;
            }
            if (!entry.liveuntil || !entry.userId) {
                await UserTokenRepository.Delete(entry.id);
                return;
            }
            if (entry.liveuntil <= MIS_DT.GetExact()) {
                const user = await UserRepository.GetById(entry.userId);

                if (!user) {
                    return;
                }

                user.DEAUTHORIZED_DT = MIS_DT.GetExact();
                user.timeonline = (user.timeonline || 0) + user.DEAUTHORIZED_DT - user.AUTHORIZED_DT;

                UserRepository.Update(user);

                entry.active = false;
                UserTokenRepository.Update(entry);
                console.log(`Dropping session of ${user.username}`);
            }
        });
    }

    public async TryAuthWeb(login: string, pswd: string) {
        const user = await UserRepository.GetByLogin(login);

        if (!user) {
            return new WebResponse<User>(false, ResponseTypes.WrongLoginOrPassword);
        }

        if (user.blocked) {
            return new WebResponse<User>(false, ResponseTypes.BlockedByAdmin);
        }

        if (pswd === user.password || pswd === ToMD5(user.password || "")) {
            user.AUTHORIZED_DT = MIS_DT.GetExact();
            UserRepository.Update(user);
            return new WebResponse<User>(true, ResponseTypes.OK).SetData(user);
        }
        return new WebResponse<User>(false, ResponseTypes.WrongLoginOrPassword);
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
