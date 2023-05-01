import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { Group } from "../entities/Group";

const GroupsConnection = () => Connection<Group>("Groups");
export const GroupRepository = new EntityFactory<Group>(GroupsConnection);