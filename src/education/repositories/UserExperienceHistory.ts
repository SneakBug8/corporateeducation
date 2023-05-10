import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { UserExperienceHistory } from "../entities/UserExperienceHistory";

class UserExperienceHistoryRepositoryClass extends EntityFactory<UserExperienceHistory> {

}

const UserExperienceHistoryConnection = () => Connection<UserExperienceHistory>("UserExperienceHistory");
export const UserExperienceHistoryRepository = new UserExperienceHistoryRepositoryClass(UserExperienceHistoryConnection);