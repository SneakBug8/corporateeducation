export class LeagueRow {
    public userId: number;
    public username: string;
    public experience: number;
    public lastFinishedDate: number;

    public constructor(userId: number, username: string, experience: number,
        lastFinishedDate: number) {
        this.userId = userId;
        this.username = username;
        this.experience = experience;
        this.lastFinishedDate = lastFinishedDate;
    }
}