import { Connection } from "../../Database";
import { EntityFactory } from "../../entity/EntityFactory";
import { ExerciseStepAnswer } from "../entities/ExerciseStepAnswer";

const connection = () => Connection<ExerciseStepAnswer>("ExerciseStepAnswers");
export const ExerciseStepAnswersRepository = new EntityFactory<ExerciseStepAnswer>(connection);
