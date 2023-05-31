import { Connection } from "../Database";
import { EntityFactory } from "../entity/EntityFactory";
import { Feedback } from "./Feedback";

class FeedbackRepositoryClass extends EntityFactory<Feedback> {

}

export const FeedbackConnection = () => Connection<Feedback>("Feedback");
export const FeedbackRepository = new FeedbackRepositoryClass(FeedbackConnection);