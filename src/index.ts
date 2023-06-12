import * as dotenv from "dotenv";
dotenv.config();

// import { BotAPI } from "./api/bot";
import { Config } from "./config";
// import { BackupCycle, InitBackup, ProcessBackup } from "./backup/BackupService";
import { Sleep } from "./util/Sleep";
import { Scheduler } from "./util/Scheduler";
import { ErrorLogger } from "./util/ErrorLogger";
import { SyncEvent } from "./util/SyncEvent";

import { EducationWebService } from "./education/EducationController";
import { UsersWebService } from "./users/UsersController";
import { AuthService } from "./users/AuthService";
import { LeagueController } from "./leagues/LeagueController";

import { FeedbackController } from "./feedback/FeedbackController";
import { AchievementsController } from "./achievements/AchievementsController";
import { AchievementsService } from "./achievements/AchievementsService";
import TelegramBot = require("node-telegram-bot-api");


class App {
    // private bot: TelegramBot;
    private readingMessage: boolean = false;
    public loaded = false;

    public MessageEvent = new SyncEvent<undefined>();
    public IntervalEvent = new SyncEvent<undefined>();

    public async WaitForLoad() {
        while (!this.loaded) {
            await Sleep(500);
        }
    }

    public Init() {
        /*

        this.bot = BotAPI;

        this.bot.on("text", async (msg) =>
        {
            while (this.readingMessage) {
                await Sleep(100);
            }
            this.readingMessage = true;
            await this.messageHandler(msg);
            this.readingMessage = false;

        });

*/
        EducationWebService.Init();
        UsersWebService.Init();
        LeagueController.Init();
        FeedbackController.Init();
        AchievementsController.Init();

        AchievementsService.Init()

        setInterval(this.Intervals.bind(this), 5 * 60 * 1000);
    }

    public async Intervals() {
        const listeners = [
            // Scheduler.Interval.bind(Scheduler),
            // BackupCycle,
            AuthService.ReviewTokens.bind(AuthService),
        ];

        for (const listener of listeners) {
            try {
                const r = await listener();
            }
            catch (e) {
                ErrorLogger.Log(e);
            }
        }

        this.IntervalEvent.Emit(undefined);
    }
    /*
    private async messageHandler(msg: TelegramBot.Message)
    {
        try {
            const message = new MessageWrapper(msg);
            const time = message.getPrintableTime();
            console.log(`[${time}] ${msg.text}`);

            if (message.checkRegex(/^\/id/)) {
                message.reply(`Current chat id: ${message.message.chat.id}`); return;
            }

            if (message.checkRegex(/^\/auth/)) {
                AuthService.ResetAuth();
            }

            let res = AuthService.CheckAuth(msg.chat.id);
            if (!res) {
                res = AuthService.TryAuthTelegram(msg.text + "", msg.chat.id);
                if (res) {
                    message.reply("Authorized successfuly")
                        .then((newmsg) => newmsg.deleteAfterTime(1));
                    return;
                }
                else {
                    message.reply("Wrong password")
                        .then((newmsg) => newmsg.deleteAfterTime(1));
                    return;
                }
            }

            if (!res) {
                message.reply("You are not authorized")
                    .then((newmsg) => newmsg.deleteAfterTime(1));
                return;
            }

            if (!msg.text) {
                return;
            }

            if (waitingCallback) {
                if (message.message.text === "/exit") {
                    waitingCallback = null; return;
                }

                const callback = waitingCallback;
                waitingCallback = null;
                await callback.call(this, message);

                return true;
            }

            if (message.checkRegex(/\/exit/)) {
                return message.reply("Main module.");
            }

            if (message.checkRegex(/\/extra/)) {
                return Server.SendMessage("Extra modules", extraKeyboard());
            }

            const listeners = [
                ProcessBackup,
            ];

            for (const listener of listeners) {
                const r = await listener(message);
                if (r !== false) {
                    return;
                }
            }

            const d = await this.MessageEvent.Emit(message);
            if (d) {
                return;
            }

                message.reply("Unknown command");
        }
        catch (e) {
            Server.SendMessage(e + "");
        }
    }

    public async SendMessage(text: string, keyboard: TelegramBot.KeyboardButton[][] | null = null)
    {
        try {
            console.log(text);
            const msg = await BotAPI.sendMessage(Config.DefaultChat, text || "null", {
                parse_mode: "Markdown",
                reply_markup: {
                    keyboard: keyboard || defaultKeyboard(),
                }
            });
            return new MessageWrapper(msg);
        }
        catch (e) {
            console.error(JSON.parse(JSON.stringify(e)));
            const msg = await BotAPI.sendMessage(Config.DefaultChat, JSON.stringify(e) || "Error: null", {
                parse_mode: "Markdown",
                reply_markup: {
                    keyboard: keyboard || defaultKeyboard(),
                }
            });
            return new MessageWrapper(msg);
        }
    }*/
}

export const Server = new App();
Server.Init();

console.log("Bot started");
async function a() {
    try {
    console.log(`Server ip ${await Config.ip()}`);
    }   
    catch (e) {
        console.error(e);
    }
}
a();

/*
if (!Config.isTest() && !Config.isDev()) {
    Server.SendMessage("Bot restarted");
}*/
Server.loaded = true;
