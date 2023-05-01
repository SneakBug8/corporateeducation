import { EducationService } from "../../education/EducationService";
import { User } from "../../users/User";
import * as assert from "assert";
import { League } from "../../leagues/League";
import { MIS_DT } from "../../util/MIS_DT";
import { LeaguesService } from "../../leagues/LeaguesService";

const testgroup = 1;
const exerciseid = 1;

let testuser = 0;
let testleague = 0;
const login = "test" + Math.round(Math.random() * 100);
const passw = "test" + Math.round(Math.random() * 100);

describe("Leagues", () => {
    it("CreateUser", async () => {
        const user = new User();
        user.username = login;
        user.password = passw;
        user.group = testgroup;

        testuser = await User.Insert(user);
    });
    it("Create a League", async () => {
        const league = new League();
        league.ends = MIS_DT.GetExact() + MIS_DT.OneDay() * 30;
        league.starts = MIS_DT.GetExact() - MIS_DT.OneDay() * 30;
        league.group = testgroup;

        testleague = await League.Insert(league);
    });
    it("Complete a task", async () => {
        console.log(await EducationService.GetTaskContent(testuser, exerciseid));

        // Read text step
        const r1 = await EducationService.PassStep(testuser, exerciseid);
        assert.ok(r1.Is(true), "Task wasn't finished");

        // Answer a question step
        const r2 = await EducationService.PassStep(testuser, exerciseid, "1");
        assert.ok(r2.Is(true), "Task wasn't finished");

        // Answer an input step
        const r3 = await EducationService.PassStep(testuser, exerciseid, "input");
        assert.ok(r3.Is(true), "Task wasn't finished");

        // As we finished all steps, task should've been finished
        const finished = await EducationService.DidUserFinishTask(testuser, exerciseid);

        assert.ok(finished, "Task wasn't finished");
    });
    it("Retrieve a League", async () => {
        const leaderboard = await LeaguesService.GetLeaderboard(testleague);

        console.log(leaderboard);

        const entry = leaderboard.filter((x) => x.userId === testuser);

        assert.ok(entry.length, "User should be present in the leaderboard");
    });
});
