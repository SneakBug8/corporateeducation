import { WebApi } from "../api/web";
import * as express from "express";
import { Logger } from "winston";
import { IMyRequest } from "../api/WebClientUtil";
import { ParseAdminQuery } from "../api/AdminQuery";
import { Exercise } from "./Exercise";
import { WebResponse } from "../web/WebResponse";
import { ResponseTypes } from "../web/ResponseTypes";
import { ExerciseStep } from "./ExerciseStep";
import { ExerciseRun } from "./ExerciseRun";

class EducationWebServiceClass {
    public Init() {
        WebApi.app.get("/api/exercises/:id", this.onExerciseGet);
        WebApi.app.post("/api/exercises", this.onExerciseInsert);
        WebApi.app.put("/api/exercises/:id", this.onExerciseUpdate);
        WebApi.app.delete("/api/exercises/:id", this.onExerciseDelete);
        WebApi.app.all("/api/exercises", this.onGetExercises);

        WebApi.app.get("/api/steps/:id", this.onStepGet);
        WebApi.app.post("/api/steps", this.onStepInsert);
        WebApi.app.put("/api/steps/:id", this.onStepUpdate);
        WebApi.app.delete("/api/steps/:id", this.onStepDelete);
        WebApi.app.all("/api/steps", this.onGetSteps);

        WebApi.app.get("/api/runs/:id", this.onRunGet);
        WebApi.app.post("/api/runs", this.onRunInsert);
        WebApi.app.put("/api/runs/:id", this.onRunUpdate);
        WebApi.app.delete("/api/runs/:id", this.onRunDelete);
        WebApi.app.all("/api/runs", this.onGetRuns);
    }

    public async onExerciseGet(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await Exercise.GetById(id);
        res.json(r);
    }

    public async onExerciseInsert(req: IMyRequest, res: express.Response) {
        const exercise = req.body as Exercise;

        console.log(exercise);

        const r = await Exercise.Insert(exercise);

        res.json(r);
    }

    public async onExerciseUpdate(req: IMyRequest, res: express.Response) {
        let exercise = req.body as Exercise;

        if (!exercise || !exercise.id) {
            return;
        }

        const r = await Exercise.Update(exercise);
        res.json(r);
    }

    public async onExerciseDelete(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await Exercise.Delete(id);
        res.json({ id: r });
    }

    public async onGetExercises(req: IMyRequest, res: express.Response) {
        try {
            const Exercises = await Exercise.GetMany(req.query);

            const adminquery = ParseAdminQuery(req.query);
            const count = await Exercise.Count();

            res.header("Content-Range", `exercises ${adminquery.from}-${adminquery.to}/${count}`);
            res.json(Exercises);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async onStepGet(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await ExerciseStep.GetById(id);
        res.json(r);
    }

    public async onStepInsert(req: IMyRequest, res: express.Response) {
        const exercise = req.body as ExerciseStep;

        console.log(exercise);

        const r = await ExerciseStep.Insert(exercise);

        res.json(r);
    }

    public async onStepUpdate(req: IMyRequest, res: express.Response) {
        const e = req.body as ExerciseStep;

        if (!e || !e.id) {
            return;
        }

        const r = await ExerciseStep.Update(e);
        res.json(r);
    }

    public async onStepDelete(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await ExerciseStep.Delete(id);
        res.json({ id: r });
    }

    public async onGetSteps(req: IMyRequest, res: express.Response) {
        try {
            const r = await ExerciseStep.GetMany(req.query);

            const adminquery = ParseAdminQuery(req.query);
            const count = await ExerciseStep.Count();

            res.header("Content-Range", `exercises ${adminquery.from}-${adminquery.to}/${count}`);
            res.json(r);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async onRunGet(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await ExerciseRun.GetById(id);
        res.json(r);
    }

    public async onRunInsert(req: IMyRequest, res: express.Response) {
        const exercise = req.body as ExerciseRun;

        console.log(exercise);

        const r = await ExerciseRun.Insert(exercise);

        res.json(r);
    }

    public async onRunUpdate(req: IMyRequest, res: express.Response) {
        const e = req.body as ExerciseRun;

        if (!e || !e.id) {
            return;
        }

        const r = await ExerciseRun.Update(e);
        res.json(r);
    }

    public async onRunDelete(req: IMyRequest, res: express.Response) {
        const id = Number.parseInt(req.params.id, 10);
        const r = await ExerciseRun.Delete(id);
        res.json({ id: r });
    }

    public async onGetRuns(req: IMyRequest, res: express.Response) {
        try {
            const r = await ExerciseRun.GetMany(req.query);

            const adminquery = ParseAdminQuery(req.query);
            const count = await ExerciseRun.Count();

            res.header("Content-Range", `runs ${adminquery.from}-${adminquery.to}/${count}`);
            res.json(r);
        }
        catch (e) {
            console.error(e);
        }
    }
}

export const EducationWebService = new EducationWebServiceClass();
