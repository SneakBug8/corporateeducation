import { ResponseTypes } from "./ResponseTypes";

export class WebResponse {

    private ok: boolean;
    private reason: ResponseTypes = ResponseTypes.Null;

    public history = new Array<ResponseTypes>();

    public constructor(ok: boolean, reason: ResponseTypes) {
        this.ok = ok;
        this.reason = reason;

        this.history.push(reason);
    }

    public SetStatus(ok: boolean, reason: ResponseTypes) {
        this.ok = ok;
        this.reason = reason;
        this.history.push(reason);
    }

    public GetReason() {
        return this.reason;
    }

    public Is(expect: boolean) {
        return this.ok === expect;
    }

    public Expect(expect: boolean) {
        if (this.ok !== expect) {
            throw new Error(this.reason + "");
        }

        return expect;
    }
}