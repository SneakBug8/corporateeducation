import { Config } from "../config";
import { MIS_DT } from "../util/MIS_DT";
import { User } from "./User";

class AuthServiceClass {
    public chatId: number | undefined;

    public AuthenticatedTokens = new Map<string, string>();

    public CreateToken(login: string) {
        if (!User.HasByLogin(login)) {
            throw new Error("No such User to create token");
        }

        let token = "t" + Math.round(Math.random() * 11);

        while (!this.AuthenticatedTokens.has(token)) {
            token = "t" + Math.round(Math.random() * 11);
        }

        this.AuthenticatedTokens.set(token, login);
    }

    public async RetrieveByToken(token: string) {
        if (!this.AuthenticatedTokens.has(token)) {
            return null;
        }

        const login = this.AuthenticatedTokens.get(token) as string;

        const user = await User.GetByLogin(login);

        if (!user) {
            return null;
        }

        return user;
    }

    public async TryAuthWeb(login: string, pswd: string): Promise<boolean> {
        const user = await User.GetByLogin(login);

        if (!user) {
            return false;
        }

        if (pswd === user.password) {
            user.AUTHORIZED_DT = MIS_DT.GetExact();
            User.Update(user);
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
