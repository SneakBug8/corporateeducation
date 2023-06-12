import TelegramBot = require("node-telegram-bot-api");
import { BotAPI } from "./api/bot";
import dateFormat = require("dateformat");
import { MIS_DT } from "./util/MIS_DT";

let waitingCallback: ((message: MessageWrapper) => any) | null = null;


export function setWaitingForValue(message: string, callback: (message: MessageWrapper) => any) {
    // Server.SendMessage(message, [[{ text: "/exit" }]]);
    waitingCallback = callback;
}

export function setWaitingForValuePure(callback: (message: MessageWrapper) => any) {
    waitingCallback = callback;
}

export function defaultKeyboard(): TelegramBot.KeyboardButton[][]
{
    return [
        [{ text: "/slots" }, { text: "/slot prev" }, { text: "/slot next" }],
    ];
}

export function extraKeyboard(): TelegramBot.KeyboardButton[][]
{
    return [
        [{ text: "/notify" }, { text: "/timer" }, { text: "/networking policy set" }],
        [{ text: "/exit" }],
    ];
}

export class MessageWrapper
{
    public message: TelegramBot.Message;

    constructor(message: TelegramBot.Message)
    {
        this.message = message;
    }

    public deleteAfterTime(minutes: number)
    {
        setTimeout(() =>
        {
            BotAPI.deleteMessage(this.message.chat.id, this.message.message_id.toString());
            console.log(`Deleting message ${this.message.message_id}`);
        }, 1000 * 60 * minutes);

        return this;
    }

    public async reply(text: string, keyboard: TelegramBot.KeyboardButton[][] | null = null)
    {
        const msg = await BotAPI.sendMessage(this.message.chat.id, text || "None.", {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: keyboard || defaultKeyboard(),
            },
        });
        return new MessageWrapper(msg);
    }

    public async replyMany(texts: string[])
    {
        const res = [];
        for (const message of texts) {
            if (!message.length) {
                continue;
            }
            const msg = await BotAPI.sendMessage(this.message.chat.id, message);
            res.push(new MessageWrapper(msg));
        }
        return res;
    }

    public checkRegex(regexp: RegExp)
    {
        if (!this.message.text) {
            return false;
        }

        return regexp.test(this.message.text);
    }

    public captureRegex(regexp: RegExp)
    {
        if (!this.message.text) {
            return undefined;
        }

        const captures = regexp.exec(this.message.text);

        if (!captures) { return undefined; }

        return captures;
    }

    public getPrintableTime()
    {
        const now = this.message.date * 1000;
        return MIS_DT.FormatTime(now);
    }
}
