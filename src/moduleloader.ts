// import * as appmodulepath from "app-module-path";
import "app-module-path/register";
import * as appmodulepath from "app-module-path";

import { MyLogger } from "./util/MyLogger";

appmodulepath.addPath(__dirname);

export const Load = async () => {
    MyLogger.info("Modules initialized in " + __dirname);
};