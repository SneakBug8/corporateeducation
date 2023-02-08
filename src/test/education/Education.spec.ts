import * as assert from "assert";
import "mocha";
import { Config } from "../../config";
import { EducationService } from "../../education/EducationService";
import { Exercise } from "../../education/Exercise";
import { ExerciseRun } from "../../education/ExerciseRun";
import { UserAnswer } from "../../education/UserAnswer";
import { User } from "../../users/User";
import { Check } from "../../util/Check";
import { Sleep } from "../../util/Sleep";

describe("Exercises", () => {
    it("GetExercisesDummy", async () => {
        await Exercise.GetAll();
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseDummy", async () => {
        await Exercise.GetById(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseByNameDummy", async () => {
        await Exercise.GetByName("");
        // assert.ok(1 > 0, "Traded goods")
    });
});


describe("Runs", () => {
    it("GetRunsDummy", async () => {
        await ExerciseRun.GetAll();
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetRun", async () => {
        await ExerciseRun.GetById(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseWithUser", async () => {
        await ExerciseRun.GetWithUser(0);
        // assert.ok(1 > 0, "Traded goods")
    });

    it("GetExerciseWithExercise", async () => {
        await ExerciseRun.GetWithExercise(0);
        // assert.ok(1 > 0, "Traded goods")
    });
});

let id = 0;
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

        id = await User.Insert(user);
    });

    it("CanDoTaskNegative", async () => {
        const r1 = await EducationService.CanDoTask(id, nextexerciseid);
        assert.ok(r1.Is(false), "Task 2 should be unavailable");
    });

    it("Complete a task", async () => {
        Config.TimePerQuestion = 0.01;

        await EducationService.StartTask(id, exerciseid);

        console.log(await EducationService.GetTaskContent(id, exerciseid));

        // Read text step
        const r1 = await EducationService.PassStep(id, exerciseid);
        assert.ok(r1.Is(true), "Task wasn't finished");

        await Sleep(0.5 * 1000);

        // Answer a question step
        const r2 = await EducationService.PassStep(id, exerciseid, "1");
        assert.ok(r2.Is(true), "Task wasn't finished");

        await Sleep(0.5 * 1000);

        // Answer an input step
        const r3 = await EducationService.PassStep(id, exerciseid, "input");
        assert.ok(r3.Is(true), "Task wasn't finished");

        // As we finished all steps, task should've been finished
        const finished = await EducationService.DidFinishTask(id, exerciseid);

        assert.ok(finished, "Task wasn't finished");
    });

    it("CanDoTaskPositive", async () => {
        const r1 = await EducationService.CanDoTask(id, nextexerciseid);
        assert.ok(r1.Is(true), "Task 2 should be available");
    });

    it("CanDoTaskMultipleDependenciesNegative", async () => {
        const r1 = await EducationService.CanDoTask(id, multipledependenciesid);
        assert.ok(r1.Is(false), "Task 3 should be unavailable");
    });

    it("Complete second task", async () => {
        console.log(await EducationService.GetTaskContent(id, nextexerciseid));

        // Read text step
        const r1 = await EducationService.PassStep(id, nextexerciseid);
        assert.ok(r1.Is(true), "Task wasn't finished");
        // As there was just one step, task should've been finished
        const finished = await EducationService.DidFinishTask(id, nextexerciseid);

        assert.ok(finished, "Task wasn't finished");
    });

    it("CanDoTaskMultipleDependenciesPositive", async () => {
        const r1 = await EducationService.CanDoTask(id, multipledependenciesid);
        assert.ok(r1.Is(true), "Task 3 should be available");
    });

    it("Experience Calculation", async () => {
        experience = await EducationService.TotalExperience(id);
        console.log(`Experience got is ${experience}`);
        assert.ok(experience > 0, "User got no experience");
    });

    it("InputStepAnswerPresent", async () => {
        const r1 = await UserAnswer.GetWithUserAndExercise(id, exerciseid);
        assert.ok(r1, "User input should be available");
    });

    it("InputStepMarked", async () => {
        await EducationService.MarkAnswer(id, exerciseid, inputstepno, 5);
    });

    it("Experience updated", async () => {
        const r1 = await EducationService.TotalExperience(id);
        assert.ok(r1 > experience, "User experience should have grown");
    });
});

const testuser = id;
const testgroup = 1;
const lockedexercise = 4;

describe("ExerciseSchedule", () => {
    it("User without a group can't start task", async () => {

    });
    it("Add user to the group", async () => {

    });
    it("User can't do a task with no schedule", async () => {

    });
    it("Create a schedule", async () => {

    });
    it("Set maxdt smaller curdt", async () => {

    });
    it("Set mindt smaller curdt", async () => {

    });
    it("User can do a proper task", async () => {

    });
    it("User can restart a task with smaller xp", async () => {

    });
    it("User can restart a task with OK xp", async () => {

    });
    it("User can't restart a task with bad xp", async () => {

    });
    it("User can't restart a task with too many tries", async () => {

    });
});
