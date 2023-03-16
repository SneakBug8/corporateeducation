import { MIS_DT } from "../util/MIS_DT";
import * as knex from "knex";
import { ConvertAdminQuery } from "../api/AdminQuery";
import { Entity } from "./Entity";

export class EntityFactory<T extends Entity> {
    public Repository: () => knex.QueryBuilder;

    public constructor(repo: () => knex.QueryBuilder) {
        this.Repository = repo;
    }

    public Parse(t: T) {
        return t;
    }

    public Cleanup(t: T) {
        return t;
    }

    public async GetById(id: number) {
        const entries = await this.Repository().where("id", "LIKE", `%${id}%`).select();

        if (entries.length) {
            return this.Parse(entries[0]);
        }
    }

    public async GetByName(name: string) {
        const entries = await this.Repository().where("name", "LIKE", `%${name}%`).select();

        if (entries.length) {
            return this.Parse(entries[0]);
        }
    }

    public async GetAll() {
        const entries = await this.Repository().select() as T[];

        const r = entries.map((x) => this.Parse(x));

        return r;
    }

    public async Delete(id: number) {
        await this.Repository().delete().where("id", id);
    }

    public async Insert(exercise: T) {
        exercise = this.Cleanup(exercise);
        exercise.MIS_DT = MIS_DT.GetExact();
        exercise.UPDATED_DT = MIS_DT.GetExact();
        const r = await this.Repository().insert(exercise);

        exercise.id = r[0];
        return this.Parse(exercise);
    }

    public async Update(exercise: T) {
        exercise = this.Cleanup(exercise);
        exercise.UPDATED_DT = MIS_DT.GetExact();
        await this.Repository().where("id", exercise.id).update(exercise);
        return this.Parse(exercise);
    }

    public async GetMany(query: any) {
        const data = await ConvertAdminQuery(query, this.Repository().select()) as T[];
        const r = data.map((x) => this.Parse(x));

        return r;
    }

    public async Count(): Promise<number> {
        const data = await this.Repository().count("id as c").first() as any;

        if (data) {
            return data.c;
        }

        return 0;
    }
}