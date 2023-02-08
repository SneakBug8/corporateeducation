import { Load } from "../moduleloader";
import { Runner } from "../Runner";
Load();

Runner.Init();

exports.mochaHooks = {
    async afterEach()
    {
    }
};