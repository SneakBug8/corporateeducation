import { ConvertAdminQuery } from "../../api/AdminQuery";
import { Connection } from "../../Database";
import { Entity } from "../../entity/Entity";
import { MIS_DT } from "../../util/MIS_DT";

export class Exercise extends Entity {

    public name: string | undefined;
    public previousexercises: string | undefined;
    public public: boolean = true;
}

