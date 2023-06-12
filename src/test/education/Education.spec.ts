import * as assert from "assert";
import "mocha";
import { Config } from "../../config";
import { ExerciseRepository } from "../../education/repositories/ExerciseRepository";
import { ExerciseRunRepository } from "../../education/repositories/ExerciseRunRepository";
import { ExerciseScheduleRepository } from "../../education/repositories/ExerciseScheduleRepository";
import { UserAnswerRepository } from "../../education/repositories/UserAnswerRepository";
import { EducationService } from "../../education/EducationService";
import { Exercise } from "../../education/entities/Exercise";
import { ExerciseSchedule } from "../../education/entities/ExerciseSchedule";
import { User } from "../../users/entities/User";
import { Check } from "../../util/Check";
import { MIS_DT } from "../../util/MIS_DT";
import { Sleep } from "../../util/Sleep";
import { WebResponse } from "../../web/WebResponse";
import { UserRepository } from "../../users/repositories/UserRepository";

async function interact(descr: string, fun: () => any) {
    const r = await fun();
    console.log(`${descr}: ${JSON.stringify(r)}`);
    return r;
}

describe("Exercises", () => {
    it("GetExercisesDummy", async () => {
        await ExerciseRepository.GetAll();
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseDummy", async () => {
        await ExerciseRepository.GetById(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseByNameDummy", async () => {
        await ExerciseRepository.GetByName("");
        // assert.ok(1 > 0, "Traded goods")
    });
});


describe("Runs", () => {
    it("GetRunsDummy", async () => {
        await ExerciseRunRepository.GetAll();
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetRun", async () => {
        await ExerciseRunRepository.GetById(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseWithUser", async () => {
        await ExerciseRunRepository.GetWithUser(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseWithExercise", async () => {
        await ExerciseRunRepository.GetWithExercise(0);
        // assert.ok(1 > 0, "Traded goods")
    });
});

let testuser = 0;
const exerciseid = 1;
const nextexerciseid = 2;
const multipledependenciesid = 3;
const inputstepno = 2;
let experience = 0;

const login = "test" + Math.round(Math.random() * 100);
const passw = "test" + Math.round(Math.random() * 100);

describe("CheckExercise", () => {
    it("CreateUser", async () => {
        const user = new User();
        user.username = login;
        user.password = passw;

        const t = await UserRepository.Insert(user);
        testuser = t.id || 0;
    });

    it("CanDoTaskNegative", async () => {
        const r1 = await EducationService.CanUserDoTask(testuser, nextexerciseid);
        assert.ok(r1.Is(false), "Task 2 should be unavailable");
    });

    it("Complete a task", async () => {
        Config.TimePerQuestion = 0.1;

        console.log(await EducationService.GetTaskContent(testuser, exerciseid));

        // Read text step
        const r1 = await EducationService.PassStep(testuser, exerciseid);
        assert.ok(r1.Is(true), "Task wasn't finished");

        await Sleep(0.5 * 1000);

        // Answer a question step
        const r2 = await EducationService.PassStep(testuser, exerciseid, "1");
        assert.ok(r2.Is(true), "Task wasn't finished");

        await Sleep(0.5 * 1000);

        // Answer an input step
        const r3 = await EducationService.PassStep(testuser, exerciseid, "input");
        assert.ok(r3.Is(true), "Task wasn't finished");

        // As we finished all steps, task should've been finished
        const finished = await EducationService.DidUserFinishTask(testuser, exerciseid);

        assert.ok(finished, "Task wasn't finished");
    });

    it("CanDoTaskPositive", async () => {
        const r1 = await EducationService.CanUserDoTask(testuser, nextexerciseid);
        assert.ok(r1.Is(true), "Task 2 should be available");
    });

    it("CanDoTaskMultipleDependenciesNegative", async () => {
        const r1 = await EducationService.CanUserDoTask(testuser, multipledependenciesid);
        assert.ok(r1.Is(false), "Task 3 should be unavailable");
    });

    it("Complete second task", async () => {
        console.log(await EducationService.GetTaskContent(testuser, nextexerciseid));

        // Read text step
        const r1 = await EducationService.PassStep(testuser, nextexerciseid);
        assert.ok(r1.Is(true), "Task wasn't finished");
        // As there was just one step, task should've been finished
        const finished = await EducationService.DidUserFinishTask(testuser, nextexerciseid);

        assert.ok(finished, "Task wasn't finished");
    });

    it("CanDoTaskMultipleDependenciesPositive", async () => {
        const r1 = await EducationService.CanUserDoTask(testuser, multipledependenciesid);
        assert.ok(r1.Is(true), "Task 3 should be available");
    });

    it("Experience Calculation", async () => {
        experience = await EducationService.GetUserTotalExperience(testuser);
        console.log(`Experience got is ${experience}`);
        assert.ok(experience > 0, "User got no experience");
    });

    it("InputStepAnswerPresent", async () => {
        const r1 = await UserAnswerRepository.GetWithUserAndExercise(testuser, exerciseid);
        assert.ok(r1, "User input should be available");
    });

    it("InputStepMarked", async () => {
        await EducationService.MarkAnswer(testuser, exerciseid, inputstepno, 5);
    });

    it("Experience updated", async () => {
        const r1 = await EducationService.GetUserTotalExperience(testuser);
        assert.ok(r1 > experience, "User experience should have grown");
    });
});

const testgroup = 1;
const lockedexercise = 4;

describe("ExerciseSchedule", () => {
    it("User without a group can't start task", async () => {
        const r1 = await EducationService.CanUserDoTask(testuser, lockedexercise);
        assert.ok(r1.Is(false), "Task should be unavailable");
    });
    it("Add user to the group", async () => {
        const user = await UserRepository.GetById(testuser);

        if (!user) {
            throw Error("No such user");
        }
        user.group = testgroup;

        await UserRepository.Update(user);
    });
    it("User can't do a task with no schedule", async () => {
        const s = await ExerciseScheduleRepository.GetWithExerciseAndGroup(lockedexercise, testgroup);

        if (s) {
            await ExerciseScheduleRepository.Delete(s);
        }

        const r1 = await EducationService.CanUserDoTask(testuser, lockedexercise);
        assert.ok(r1.Is(false), "Task should be unavailable");
    });
    it("Create a schedule", async () => {
        const s = await ExerciseScheduleRepository.GetWithExerciseAndGroup(lockedexercise, testgroup);

        if (s) {
            await ExerciseScheduleRepository.Delete(s);
        }
        const schedule = new ExerciseSchedule();
        schedule.groupId = testgroup;
        schedule.exerciseId = lockedexercise;
        schedule.endsDt = MIS_DT.GetExact() + MIS_DT.OneDay() * 30;
        schedule.startsDt = MIS_DT.GetExact() - MIS_DT.OneDay() * 30;
        schedule.minExp = 9;
        schedule.maxExp = 9;

        await ExerciseScheduleRepository.Insert(schedule);
    });
    it("Set maxdt smaller curdt", async () => {
        const schedule = await ExerciseScheduleRepository.GetWithExerciseAndGroup(lockedexercise, testgroup);

        if (!schedule) {
            throw Error("No such schedule");
        }

        schedule.endsDt = MIS_DT.GetExact() - MIS_DT.OneDay() * 30;

        await ExerciseScheduleRepository.Update(schedule);

        const r1 = await EducationService.CanUserDoTask(testuser, lockedexercise);
        assert.ok(r1.Is(false), "Task should be unavailable");
    });
    it("Set mindt bigger curdt", async () => {
        const schedule = await ExerciseScheduleRepository.GetWithExerciseAndGroup(lockedexercise, testgroup);

        if (!schedule) {
            throw Error("No such schedule");
        }

        schedule.endsDt = MIS_DT.GetExact() + MIS_DT.OneDay() * 30;
        schedule.startsDt = MIS_DT.GetExact() + MIS_DT.OneDay() * 30;

        await ExerciseScheduleRepository.Update(schedule);

        const r1 = await EducationService.CanUserDoTask(testuser, lockedexercise);
        assert.ok(r1.Is(false), "Task should be unavailable");
    });
    it("User can do a task with proper Schedule", async () => {
        const schedule = await ExerciseScheduleRepository.GetWithExerciseAndGroup(lockedexercise, testgroup);

        if (!schedule) {
            throw Error("No such schedule");
        }

        schedule.endsDt = MIS_DT.GetExact() + MIS_DT.OneDay() * 30;
        schedule.startsDt = MIS_DT.GetExact() - MIS_DT.OneDay() * 30;

        await ExerciseScheduleRepository.Update(schedule);

        const r1 = await EducationService.CanUserDoTask(testuser, lockedexercise);
        assert.ok(r1.Is(true), "Task should be available");
    });
    it("User can't finish task with too little xp", async () => {
        Config.TimePerQuestion = 100;

        console.log(await EducationService.GetTaskContent(testuser, lockedexercise));

        // Read text step
        const r1 = await EducationService.PassStep(testuser, lockedexercise);
        console.log(r1);
        assert.ok(r1.Is(true), "We read the text");

        // Answer a question step
        const r2 = await EducationService.PassStep(testuser, lockedexercise, "2");
        console.log(r2);
        assert.ok(r2.Is(false), "We provided wrong answer");

        // As we have answered incorrectly, we shouldn't have finished the task
        const finished = await EducationService.DidUserFinishTask(testuser, lockedexercise);
        assert.ok(!finished, "Task was finished!");
    });
    it("User can restart a task with smaller xp", async () => {

        interact("GetTaskContent", () => EducationService.GetTaskContent(testuser, lockedexercise));

        // Read text step
        const r1 = await interact("Pass text step", () => EducationService.PassStep(testuser, lockedexercise));
        assert.ok(r1.Is(true), "We read the text");

        // Answer a question step
        const r2 = await interact("Pass quiz step", () => EducationService.PassStep(testuser, lockedexercise, "1"));
        assert.ok(r2.Is(true), "We provided right answer");

        // As we have answered incorrectly, we shouldn't have finished the task
        const finished = await EducationService.DidUserFinishTask(testuser, lockedexercise);
        assert.ok(finished, "Task wasn't finished");
    });

    it("User can't restart a task with too much xp", async () => {
        const r = await interact("CanDoTask", () => EducationService.CanUserDoTask(testuser, lockedexercise));
        assert.ok(r.Is(false), "Task shouldn't be restartable");
    });
    it("User can't restart a task with too many tries", async () => {
        // TODO
    });
});
