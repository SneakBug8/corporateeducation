import { Config } from "../config";
import { User } from "../users/User";
import { MIS_DT } from "../util/MIS_DT";
import { WebResponses } from "../web/WebResponses";
import { Exercise } from "./Exercise";
import { ExerciseRun } from "./ExerciseRun";
import { ExerciseSchedule } from "./ExerciseSchedule";
import { ExerciseStep } from "./ExerciseStep";
import { UserAnswer } from "./UserAnswer";

class EducationServiceClass {
    public Init() {
    }

    public async CalculateRunExperience(exerciseId: number, time: number) {
        let res = 0;
        const steps = await ExerciseStep.GetWithExercise(exerciseId);
        for (const step of steps) {
            if (step.type === "input") {
                continue;
            }
            res += step.experience;
        }

        // 60 seconds per step or else drop experience
        return res * Math.min(1, steps.length * Config.TimePerQuestion / Math.max(time, 1));
    }

    public async GetTask(userId: number, exerciseId: number) {
        if (!await this.CanDoTask(userId, exerciseId)) {
            return WebResponses.NotEligibleForTask;
        }

        let run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);

        if (!run) {
            run = await this.StartTask(userId, exerciseId);
        }

        const step = await ExerciseStep.GetWithExerciseAndNumber(exerciseId, run.step);

        if (!step) {
            throw new Error("No such step");
        }

        return JSON.parse(step.content || "{}");
    }

    public async CanDoTask(userId: number, exerciseId: number) {
        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            throw new Error(WebResponses.NoSuchExercise);
        }

        const prevs = await Exercise.GetPreviousIDs(exercise);

        if (prevs) {

            for (const prev of prevs) {
                const r = await this.CheckEducationScheduleOnStart(userId, prev);
                console.log(`User ${userId} can ${r} do task ${prev}`);

                if (r && !await this.DidFinishTask(userId, prev)) {
                    return WebResponses.PreviousNotDone;
                }
            }
        }

        // Does the schedule allow this particular exercise
        const t = await this.CheckEducationScheduleOnStart(userId, exerciseId);
        console.log(`User ${userId} can ${t} do task ${exerciseId}`);

        if (t !== true) {
            return false;
        }

        if (!exercise.public) {
            // Check if the exercise was unlocked to the group
            return false;
        }

        return true;
    }

    public async DidFinishTask(userId: number, exerciseId: number) {
        const run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);

        if (!run) {
            return false;
        }

        return run.finished;
    }

    public async StartTask(userId: number, exerciseId: number) {
        if (!await this.CanDoTask(userId, exerciseId)) {
            throw new Error("You are not eligible to start task");
        }

        const run = new ExerciseRun();
        run.exercise = exerciseId;
        run.user = userId;

        await ExerciseRun.Insert(run);

        return run;
    }

    public async RestartTask(run: ExerciseRun) {
        run.finished = false;
        run.step = 0;
        await ExerciseRun.Update(run);
    }

    public async PassStep(userId: number, exerciseId: number, answer: string = "") {
        if (!await this.CanDoTask(userId, exerciseId)) {
            throw new Error("You are not eligible to do this task");
        }

        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            throw new Error(WebResponses.NoSuchExercise);
        }

        let run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);

        if (!run) {
            run = await this.StartTask(userId, exerciseId);
        }

        if (run.finished) {
            await this.RestartTask(run);
        }

        const r = await this.CheckAnswer(userId, exerciseId, run.step, answer);

        if (r) {
            run.step++;

            const noofsteps = await ExerciseStep.Count(run.exercise);

            if (run.step === noofsteps) {
                const now = MIS_DT.GetExact();
                const time = Math.floor(now - run.MIS_DT) / 1000;
                run.experience = await this.CalculateRunExperience(run.exercise, 0);

                await ExerciseRun.Update(run);

                const t = await this.CheckEducationScheduleOnRunSubmission(userId, exerciseId);

                if (t === true) {
                    run.finished = true;
                    await ExerciseRun.Update(run);
                }
                else if (t === WebResponses.NotEnoughXp) {
                    await this.RestartTask(run);
                    throw new Error(t);
                }
                else {
                    throw new Error(t);
                }
            }

            return true;
        }

        return false;
    }

    public async CheckAnswer(userId: number, exerciseId: number, stepno: number, answer: string) {
        const exercise = await Exercise.GetById(exerciseId);
        const step = await ExerciseStep.GetWithExerciseAndNumber(exerciseId, stepno);

        if (!exercise) {
            throw new Error("No such exercise");
        }

        if (!step) {
            throw new Error("No such step");
        }

        if (step.type === "text") {
            return true;
        }
        if (step.type === "video") {
            return true;
        }
        if (step.type === "quiz") {
            return step.answer === answer;
        }
        if (step.type === "input") {
            // Add storing of an answer for the future
            const answer = new UserAnswer();
            answer.exercise = exerciseId;
            answer.step = stepno;
            answer.user = userId;
            await UserAnswer.Insert(answer);
            return true;
        }
        return false;
    }

    public async TotalExperience(userId: number) {
        const runs = await ExerciseRun.GetWithUser(userId);

        let res = 0;

        for (const run of runs) {
            res += run.experience || 0;
        }

        const answers = await UserAnswer.GetWithUser(userId);

        for (const answer of answers) {
            res += answer.experience || 0;
        }

        return res;
    }

    public async MarkAnswer(userId: number, exerciseId: number, stepno: number, experience: number) {
        const answer = await UserAnswer.GetExact(userId, exerciseId, stepno);
        if (!answer) {
            throw new Error("No such answer");
        }

        answer.experience = experience;
        answer.marked = true;

        await UserAnswer.Update(answer);
    }

    public async CheckEducationScheduleOnStart(userId: number, exerciseId: number) {
        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            throw new Error(WebResponses.NoSuchExercise);
        }

        // If it is public exercise
        if (exercise.public) {
            return true;
        }

        const user = await User.GetById(userId);

        if (!user) {
            return WebResponses.NoSuchUser;
        }

        // If user doesn't belong to a group
        if (!user.group) {
            return WebResponses.NoGroup;
        }

        const run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);
        const schedule = await ExerciseSchedule.GetWithExerciseAndGroup(exerciseId, user.group);

        if (!schedule) {
            return WebResponses.TaskNotOpened;
        }

        if (!run) {
            return WebResponses.NoSuchRun;
        }

        const now = MIS_DT.GetExact();

        // If task not started
        if (schedule.startsDt && now < schedule.startsDt) {
            return WebResponses.TaskNotOpened;
        }

        // If task has ended
        if (schedule.endsDt && now > schedule.endsDt) {
            return WebResponses.TaskEnded;
        }

        // If not enough XP
        if (run.experience || 0 < (schedule.minExp || 0)) {
            return WebResponses.NotEnoughXp;
        }

        // If too much XP
        if (run && (run.experience || 0) > (schedule.maxExp || 0)) {
            return WebResponses.MoreThanMaxXP;
        }

        return true;
    }

    public async CheckEducationScheduleOnRunSubmission(exerciseId: number, userId: number) {
        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            throw new Error(WebResponses.NoSuchExercise);
        }

        // If it is public exercise
        if (exercise.public) {
            return true;
        }

        const user = await User.GetById(userId);

        if (!user) {
            return WebResponses.NoSuchUser;
        }

        // If user doesn't belong to a group
        if (!user.group) {
            return WebResponses.NoGroup;
        }

        const run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);
        const schedule = await ExerciseSchedule.GetWithExerciseAndGroup(exerciseId, user.group);

        if (!schedule) {
            return WebResponses.TaskNotOpened;
        }

        if (!run) {
            return WebResponses.NoSuchRun;
        }

        const now = MIS_DT.GetExact();

        // If task not started
        if (schedule.startsDt && now < schedule.startsDt) {
            return WebResponses.TaskNotStarted;
        }

        // If task has ended
        if (schedule.endsDt && now > schedule.endsDt) {
            return WebResponses.TaskEnded;
        }

        // If not enough XP
        if (run.experience || 0 < (schedule.minExp || 0)) {
            return WebResponses.NotEnoughXp;
        }

        return true;
    }
}

export const EducationService = new EducationServiceClass();
