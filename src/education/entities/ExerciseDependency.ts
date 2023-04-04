import { ConvertAdminQuery } from "../../api/AdminQuery";
import { Connection } from "../../Database";
import { Entity } from "../../entity/Entity";
import { MIS_DT } from "../../util/MIS_DT";

export class ExerciseDependency extends Entity {
    public exerciseId: number | undefined;
    public prevExerciseId: number | undefined;
}

