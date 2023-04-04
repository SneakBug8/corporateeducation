import { Connection } from "../../Database";
import { EntityFactory } from "../../entity/EntityFactory";
import { ExerciseStepAnswer } from "../entities/ExerciseStepAnswer";

const repository = () => Connection<ExerciseStepAnswer>("ExerciseStepAnswers");
export const ExerciseController = new EntityFactory<ExerciseStepAnswer>(repository);
