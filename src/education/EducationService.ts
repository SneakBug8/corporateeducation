import { Config } from "../config";
import { User } from "../users/User";
import { Check } from "../util/Check";
import { MIS_DT } from "../util/MIS_DT";
import { ResponseTypes } from "../web/ResponseTypes";
import { WebResponse } from "../web/WebResponse";
import { Exercise } from "./Exercise";
import { ExerciseRun } from "./ExerciseRun";
import { ExerciseSchedule } from "./ExerciseSchedule";
import { ExerciseStep } from "./ExerciseStep";
import { UserAnswer } from "./UserAnswer";
import { EventEmitter } from "events";

class EducationServiceClass extends EventEmitter {

    public gainXpEvent = "gainxp";

    public Init() {
    }

    public async AdjustExperienceToTime(exerciseId: number, experience: number, time: number) {
        const steps = await ExerciseStep.GetWithExercise(exerciseId);

        // 60 seconds per step or else drop experience
        return Math.round(experience * Math.min(1, steps.length * Config.TimePerQuestion / Math.max(time, 1)));
    }

    public async GetTaskContent(userId: number, exerciseId: number) {
        const t = await this.CanDoTask(userId, exerciseId);

        if (t.Is(false)) {
            return t;
        }

        const run = await this.EnsureRun(userId, exerciseId);

        const step = await ExerciseStep.GetWithExerciseAndNumber(exerciseId, run.step);

        if (!step) {
            throw new Error("No such step");
        }

        return JSON.parse(step.content || "{}");
    }

    public async CanDoTask(userId: number, exerciseId: number) {
        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            return new WebResponse(false, ResponseTypes.NoSuchExercise);
        }

        const prevs = await Exercise.GetPreviousIDs(exercise);

        if (prevs) {
            for (const prev of prevs) {
                const r = await this.CheckEducationScheduleOnStart(userId, prev);
                // console.log(`User ${userId} can ${r.Is(true)} do task ${prev}`);

                if (r && !await this.DidFinishTask(userId, prev)) {
                    return new WebResponse(false, ResponseTypes.PreviousNotDone);
                }
            }
        }

        // Does the schedule allow this particular exercise
        const t = await this.CheckEducationScheduleOnStart(userId, exerciseId);
        // console.log(`User ${userId} can ${t.Is(true)} do task ${exerciseId}`);

        if (t.Is(false)) {
            return t;
        }

        return new WebResponse(true, ResponseTypes.OK);
    }

    public async DidFinishTask(userId: number, exerciseId: number) {
        const run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);

        console.log(`User ${userId} finished exercise ${exerciseId}: ${run && run.finished}`);
        return run && run.finished;
    }

    private async EnsureRun(userId: number, exerciseId: number) {
        let run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);

        if (!run) {
            run = await this.StartTask(userId, exerciseId);
        }

        if (run.finished) {
            run = await this.RestartTask(run);
        }
        return run;
    }

    private async StartTask(userId: number, exerciseId: number) {
        const r = await this.CanDoTask(userId, exerciseId);

        r.Expect(true);

        const run = new ExerciseRun();
        run.exercise = exerciseId;
        run.user = userId;

        await ExerciseRun.Insert(run);

        return run;
    }

    private async RestartTask(run: ExerciseRun) {
        console.log(`Task ${run.exercise} of user ${run.user} restarted`);
        run.finished = false;
        run.step = 0;
        run.experience = 0;
        await ExerciseRun.Update(run);
        return run;
    }

    public async PassStep(userId: number, exerciseId: number, answer: string = "") {
        const t = await this.CanDoTask(userId, exerciseId);

        if (t.Is(false)) {
            return t;
        }

        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            return new WebResponse(false, ResponseTypes.NoSuchExercise);
        }

        const run = await this.EnsureRun(userId, exerciseId);

        // The step we just finished
        const prevstep = await ExerciseStep.GetWithExerciseAndNumber(exerciseId, run.step);

        if (!prevstep) {
            throw new WebResponse(false, ResponseTypes.NoSuchStep);
        }

        const r = await this.CheckAnswer(userId, exerciseId, run.step, answer);

        if (r.Is(false)) {
            // Wrong answer - no XP added
            run.experience = (run.experience || 0) + 0;
            run.step++;
        }
        else {
            // Set next step
            run.step++;
            run.experience = (run.experience || 0) + prevstep.experience;
        }

        console.log(`User ${userId} passed to step ${run.step} in exercise ${exerciseId}. Current experience: ${run.experience}`);
        await ExerciseRun.Update(run);

        const noofsteps = await ExerciseStep.CountWithExercise(run.exercise);
        // steps numbered from zero: 0, 1. no of steps = 2, when step ind == 2, we have done all steps
        if (run.step === noofsteps) {
            const r1 = await this.FinalizeTask(run);
            return r1;
        }

        return r;
    }

    private async FinalizeTask(run: ExerciseRun) {
        const now = MIS_DT.GetExact();
        const time = Math.floor(now - run.MIS_DT) / 1000;
        run.experience = await this.AdjustExperienceToTime(run.exercise, run.experience || 0, time);

        await ExerciseRun.Update(run);

        const t = await this.CheckEducationScheduleOnRunSubmission(run.user, run.exercise);

        if (t.Is(true)) {
            console.log(`User ${run.user} finished exercise ${run.exercise}`);
            run.finished = true;
            run.FINISHED_DT = MIS_DT.GetExact();
            await ExerciseRun.Update(run);
            return new WebResponse(true, ResponseTypes.ExcerciseFinished);
        }
        else if (t.GetReason() === ResponseTypes.NotEnoughXp) {
            await this.RestartTask(run);
            return t;
        }
        else {
            return t;
        }
    }

    private async CheckAnswer(userId: number, exerciseId: number, stepno: number, answer: string) {
        const exercise = await Exercise.GetById(exerciseId);
        const step = await ExerciseStep.GetWithExerciseAndNumber(exerciseId, stepno);

        if (!exercise) {
            throw new Error("No such exercise");
        }

        if (!step) {
            throw new Error("No such step");
        }

        if (step.type === "text") {
            return new WebResponse(true, ResponseTypes.AutoPass);
        }
        if (step.type === "video") {
            return new WebResponse(true, ResponseTypes.AutoPass);
        }
        if (step.type === "quiz") {
            if (step.answer === answer) {
                return new WebResponse(true, ResponseTypes.CorrectAnswer);
            }
            else {
                return new WebResponse(false, ResponseTypes.WrongAnswer);
            }
        }
        if (step.type === "input") {
            // Add storing of an answer for the future
            const answer = new UserAnswer();
            answer.exercise = exerciseId;
            answer.step = stepno;
            answer.user = userId;
            await UserAnswer.Insert(answer);
            return new WebResponse(true, ResponseTypes.CollectedAnswer);
        }

        throw new Error("Not valid step type");
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

    private async CheckEducationScheduleOnStart(userId: number, exerciseId: number) {
        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            return new WebResponse(false, ResponseTypes.NoSuchExercise);
        }

        // If it is public exercise
        if (exercise.public) {
            return new WebResponse(true, ResponseTypes.OK);
        }

        const user = await User.GetById(userId);

        if (!user) {
            return new WebResponse(false, ResponseTypes.NoSuchUser);
        }

        // If user doesn't belong to a group
        if (!user.group) {
            return new WebResponse(false, ResponseTypes.NoGroup);
        }

        const run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);
        const schedule = await ExerciseSchedule.GetWithExerciseAndGroup(exerciseId, user.group);

        if (!schedule) {
            return new WebResponse(false, ResponseTypes.TaskNotOpened);
        }

        if (run && (run.experience || 0) > (schedule.maxExp || 0)) {
            return new WebResponse(false, ResponseTypes.MoreThanMaxXP);
        }

        const now = MIS_DT.GetExact();

        // If task not started
        if (schedule.startsDt && now < schedule.startsDt) {
            return new WebResponse(false, ResponseTypes.TaskNotOpened);
        }

        // If task has ended
        if (schedule.endsDt && now > schedule.endsDt) {
            return new WebResponse(false, ResponseTypes.TaskEnded);
        }

        return new WebResponse(true, ResponseTypes.OK);
    }

    private async CheckEducationScheduleOnRunSubmission(userId: number, exerciseId: number) {
        const exercise = await Exercise.GetById(exerciseId);

        if (!exercise) {
            return new WebResponse(false, ResponseTypes.NoSuchExercise);
        }

        // If it is public exercise
        if (exercise.public) {
            return new WebResponse(true, ResponseTypes.OK);
        }

        const user = await User.GetById(userId);

        if (!user) {
            return new WebResponse(false, ResponseTypes.NoSuchUser);
        }

        // If user doesn't belong to a group
        if (!user.group) {
            return new WebResponse(false, ResponseTypes.NoGroup);
        }

        const run = await ExerciseRun.GetWithUserAndExercise(userId, exerciseId);
        const schedule = await ExerciseSchedule.GetWithExerciseAndGroup(exerciseId, user.group);

        if (!schedule) {
            return new WebResponse(false, ResponseTypes.TaskNotOpened);
        }

        if (!run) {
            return new WebResponse(false, ResponseTypes.NoSuchRun);
        }

        const now = MIS_DT.GetExact();

        // If task not started
        if (schedule.startsDt && now < schedule.startsDt) {
            return new WebResponse(false, ResponseTypes.TaskNotStarted);
        }

        // If task has ended
        if (schedule.endsDt && now > schedule.endsDt) {
            return new WebResponse(false, ResponseTypes.TaskEnded);
        }

        // If not enough XP
        if ((run.experience || 0) < (schedule.minExp || 0)) {
            return new WebResponse(false, ResponseTypes.NotEnoughXp);
        }

        return new WebResponse(true, ResponseTypes.OK);
    }
}

export const EducationService = new EducationServiceClass();
