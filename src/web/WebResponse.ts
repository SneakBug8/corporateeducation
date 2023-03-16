import { ResponseTypes } from "./ResponseTypes";

export class WebResponse<T> {

    private ok: boolean;
    private reason: ResponseTypes = ResponseTypes.Null;

    private data: T | undefined = undefined;

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

    public SetData(data: T | undefined) {
        this.data = data;
        return this;
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

    public copy() {
        return Object.assign({}, this);
    }

    public toJSON() {
        return JSON.stringify(Object.assign({}, this));
    }

    public fromJSON(json: string) {
        const temp = JSON.parse(json);
        return temp as WebResponse<object>;
    }
}