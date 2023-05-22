import { Connection } from "../../Database";
import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";

export class TokenEntry extends Entity {
    userId: number | undefined;
    token: string | undefined;
    liveuntil: number | undefined;
    active: boolean = true;
}

class UserTokenRepositoryClass extends EntityFactory<TokenEntry> {
    public async GetActiveWithToken(token: string) {
        const entries = await this.Repository().where("token", token)
        .andWhere("active", true).select();
        if (entries.length) {
            return entries[0] as TokenEntry;
        }
    }

    public async GetActive() {
        const entries = await this.Repository().where("active", true).select();
        return entries as TokenEntry[];
    }
}

export const TokensConnection = () => Connection<TokenEntry>("Tokens");
export const UserTokenRepository = new UserTokenRepositoryClass(TokensConnection);