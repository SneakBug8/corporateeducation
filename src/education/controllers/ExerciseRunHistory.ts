import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { ExerciseRun } from "../entities/ExerciseRun";

class ExerciseRunHistoryClass extends EntityFactory<ExerciseRun> {
    public Cleanup(t: ExerciseRun): ExerciseRun {
        delete (t as any).userId;
        return t;
    }
}

export const RunsHistoryRepository = () => Connection<ExerciseRun>("RunsHistory").joinRaw("left join (select `id` as userId, `group` as userGroup from Users) as a on a.userId = Runs.user");
export const ExerciseRunHistory = new ExerciseRunHistoryClass(RunsHistoryRepository);