import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { ExerciseRun } from "../entities/ExerciseRun";
import { ExerciseRunHistoryRepository } from "./ExerciseRunHistory";
import { EducationService } from "../EducationService";

class ExerciseRunRepositoryClass extends EntityFactory<ExerciseRun> {
    public async GetWithUser(userId: number) {
        const entries = await this.Repository().where("userId", userId).select();
        return entries;
    }

    public async GetWithUserAndDate(userId: number, startDt: number, endDt: number) {
        const entries = await this.Repository().where("userId", userId)
            .andWhere("FINISHED_DT", ">", startDt)
            .andWhere("FINISHED_DT", "<", endDt)
            .select();
        return entries as ExerciseRun[];
    }

    public async GetWithExercise(id: number) {
        const entries = await this.Repository().where("exerciseId", id).select();
        return entries;
    }

    public async GetWithUserAndExercise(userId: number, exerciseId: number) {

        const entries = await this.Repository().where("userId", userId)
            .andWhere("exerciseId", exerciseId)
            .orderBy("trynumber", "desc").select();

            
        if (entries.length) {
            return entries[0] as ExerciseRun;
        }
    }

    public async Cleanup(t: ExerciseRun) {
        delete (t as any).userId2;
        delete (t as any).userGroup;
        return t;
    }

    public async Insert(exercise: ExerciseRun): Promise<ExerciseRun> {
        const r = await super.Insert(exercise);

        exercise.id = undefined;
        ExerciseRunHistoryRepository.Insert(exercise);

        EducationService.RecordUserTotalExperience(exercise.userId, "exercise");

        return r;
    }

    public async Update(exercise: ExerciseRun): Promise<ExerciseRun> {
        const r = await super.Update(exercise);

        exercise.id = undefined;
        ExerciseRunHistoryRepository.Insert(exercise);

        EducationService.RecordUserTotalExperience(exercise.userId, "exercise");

        return r;
    }
}

const RunsConnection = () => Connection<ExerciseRun>("Runs").joinRaw("left join (select `id` as userId2, `group` as userGroup from Users) as a on a.userId2 = Runs.userId");
export const ExerciseRunRepository = new ExerciseRunRepositoryClass(RunsConnection);