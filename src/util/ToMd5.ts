import * as crypto from "crypto";

export function ToMD5(text: string) {
    return crypto.createHash("md5").update(text).digest("hex");
}