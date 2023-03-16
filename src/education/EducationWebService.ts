import { WebApi } from "../api/web";
import { ExerciseStepController } from "./controllers/ExerciseStepController";
import { ExerciseController } from "./controllers/ExerciseController";
import { ExerciseRunController } from "./controllers/ExerciseRunController";
import { CRUDRouter } from "../api/CRUDRouter";
import { GroupController } from "./controllers/GroupController";
import { UserAnswerController } from "./controllers/UserAnswerController";
import { EducationService } from "./EducationService";
import { AuthService } from "../users/AuthService";
import { WebResponse } from "../web/WebResponse";
import { ResponseTypes } from "../web/ResponseTypes";
import { MyLogger } from "../util/MyLogger";

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

        WebApi.app.get("/api/getcontent/:id", async (req, res) => {
            try {
                const exerciseId = Number.parseInt(req.params.id, 10);
                const token = req.query.token;

                if (!token) {
                    return res.json(new WebResponse(false, ResponseTypes.NoTokenProvided).copy());
                }

                const userId = await AuthService.RetrieveByToken(token as string);

                if (!userId) {
                    return res.json(new WebResponse(false, ResponseTypes.NotAuthorized).copy());
                }

                const r = await EducationService.GetTaskContent(userId, exerciseId);

                // const rdata = new WebResponse(true, ResponseTypes.OK).SetData(r);

                res.json(r.copy());
            }
            catch (e) {
                MyLogger.error(e);
            }
        });

        WebApi.app.post("/api/passanswer/:id", async (req, res) => {
            try {
                const exerciseId = Number.parseInt(req.params.id, 10);
                const token = req.query.token;
                const answer = req.body.answer;

                if (!token) {
                    return res.json(new WebResponse(false, ResponseTypes.NoTokenProvided).copy());
                }

                if (!answer) {
                    return res.json(new WebResponse(false, ResponseTypes.WrongRequestSignature).copy());
                }

                const userId = await AuthService.RetrieveByToken(token as string);

                if (!userId) {
                    return res.json(new WebResponse(false, ResponseTypes.NotAuthorized).copy());
                }

                const r = await EducationService.PassStep(userId, exerciseId, answer);

                res.json(r.copy());
            }
            catch (e) {
                MyLogger.error(e);
            }
        });
    }

}

export const EducationWebService = new EducationWebServiceClass();
