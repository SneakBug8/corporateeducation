import { WebApi } from "../api/web";
import * as express from "express";

class EducationWebServiceClass
{
    public Init()
    {
        WebApi.app.get("/notes", this.OnNotesPage);
        WebApi.app.get("/notes/list", this.OnNotesList);
    }

    private async OnNotesPage(req: express.Request, res: express.Response)
    {
        res.render("notes");
    }

    private async OnNotesList(req: express.Request, res: express.Response)
    {
        const r = {};
        res.render("noteslist", {notes: r});
    }
}

export const EducationWebService = new EducationWebServiceClass();
