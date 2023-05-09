import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { ExerciseRun } from "../entities/ExerciseRun";

class ExerciseRunHistoryClass extends EntityFactory<ExerciseRun> {
    public async Cleanup(t: ExerciseRun) {
        delete (t as any).userId2;
        return t;
    }
}

const RunsHistoryConnection = () => Connection<ExerciseRun>("RunsHistory");
export const ExerciseRunHistoryRepository = new ExerciseRunHistoryClass(RunsHistoryConnection);