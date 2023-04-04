import { Entity } from "../../entity/Entity";
import { EntityFactory } from "../../entity/EntityFactory";
import { Connection } from "../../Database";
import { Group } from "../entities/Group";

const GroupsRepository = () => Connection<Group>("Groups");
export const GroupController = new EntityFactory<Group>(GroupsRepository);