import { WebApi } from "../api/web";
import { CRUDRouter } from "../api/CRUDRouter";
import { FeedbackRepository } from "./FeedbackRepository";

class FeedbackControllerClass {
    public Init() {
        const feedbackrouter = new CRUDRouter("feedback", FeedbackRepository);
        WebApi.app.use("/api/feedback", feedbackrouter.GetRouter());

    }

}

export const FeedbackController = new FeedbackControllerClass();
