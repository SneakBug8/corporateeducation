import { WebApi } from "../api/web";
import * as express from "express";
import { Logger } from "winston";
import { IMyRequest } from "../api/WebClientUtil";
import { ParseAdminQuery } from "../api/AdminQuery";
import { Exercise } from "./entities/Exercise";
import { ExerciseStep } from "./entities/ExerciseStep";
import { ExerciseStepController } from "./controllers/ExerciseStepController";
import { ExerciseController } from "./controllers/ExerciseController";
import { ExerciseRunController } from "./controllers/ExerciseRunController";
import { ExerciseRun } from "./entities/ExerciseRun";
import { CRUDRouter } from "../api/CRUDRouter";
import { GroupController } from "./controllers/GroupController";
import { Group } from "./entities/Group";
import { UserAnswerController } from "./controllers/UserAnswerController";

class EducationWebServiceClass {
    public Init() {
        const exerciserouter = new CRUDRouter("exercises", ExerciseController);
        WebApi.app.use("/api/exercises", exerciserouter.GetRouter());
        const steprouter = new CRUDRouter("steps", ExerciseStepController);
        WebApi.app.use("/api/steps", steprouter.GetRouter());
        const runrouter = new CRUDRouter("runs", ExerciseRunController);
        WebApi.app.use("/api/runs", runrouter.GetRouter());

        const grouprouter = new CRUDRouter("groups", GroupController);
        WebApi.app.use("/api/groups", grouprouter.GetRouter());

        const answerrouter = new CRUDRouter("answers", UserAnswerController);
        WebApi.app.use("/api/answers", answerrouter.GetRouter());
    }

}

export const EducationWebService = new EducationWebServiceClass();
