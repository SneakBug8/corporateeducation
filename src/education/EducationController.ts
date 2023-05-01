import { WebApi } from "../api/web";
import { ExerciseStepRepository } from "./repositories/ExerciseStepRepository";
import { ExerciseRepository } from "./repositories/ExerciseRepository";
import { ExerciseRunRepository } from "./repositories/ExerciseRunRepository";
import { CRUDRouter } from "../api/CRUDRouter";
import { GroupRepository } from "./repositories/GroupRepository";
import { UserAnswerRepository } from "./repositories/UserAnswerRepository";
import { EducationService } from "./EducationService";
import { AuthService } from "../users/AuthService";
import { WebResponse } from "../web/WebResponse";
import { ResponseTypes } from "../web/ResponseTypes";
import { MyLogger } from "../util/MyLogger";

class EducationControllerClass {
    public Init() {
        const exerciserouter = new CRUDRouter("exercises", ExerciseRepository);
        WebApi.app.use("/api/exercises", exerciserouter.GetRouter());
        const steprouter = new CRUDRouter("steps", ExerciseStepRepository);
        WebApi.app.use("/api/steps", steprouter.GetRouter());
        const runrouter = new CRUDRouter("runs", ExerciseRunRepository);
        WebApi.app.use("/api/runs", runrouter.GetRouter());

        const grouprouter = new CRUDRouter("groups", GroupRepository);
        WebApi.app.use("/api/groups", grouprouter.GetRouter());

        const answerrouter = new CRUDRouter("answers", UserAnswerRepository);
        WebApi.app.use("/api/answers", answerrouter.GetRouter());

        WebApi.app.get("/api/getcontent/:id", async (req, res) => {
            try {
                const exerciseId = Number.parseInt(req.params.id, 10);
                const token = req.query.token;

                if (!token) {
                    return res.json(new WebResponse(false, ResponseTypes.NoTokenProvided).copy());
                }

                const user = await AuthService.RetrieveByToken(token as string);

                if (!user || !user.id) {
                    return res.json(new WebResponse(false, ResponseTypes.NotAuthorized).copy());
                }

                const r = await EducationService.GetTaskContent(user.id, exerciseId);

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

                const user = await AuthService.RetrieveByToken(token as string);

                if (!user || !user.id) {
                    return res.json(new WebResponse(false, ResponseTypes.NotAuthorized).copy());
                }

                const r = await EducationService.PassStep(user.id, exerciseId, answer);

                res.json(r.copy());
            }
            catch (e) {
                MyLogger.error(e);
            }
        });
    }

}

export const EducationWebService = new EducationControllerClass();
