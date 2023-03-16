export class ExerciseRun {
    public id: number | undefined;
    public user: number = 0;
    public exercise: number = 0;
    public time: number | undefined;
    public experience: number | undefined;
    public data: string | undefined;
    public step: number = 0;
    public finished: boolean = false;
    public FINISHED_DT = 0;
    public MIS_DT = 0;
    public UPDATED_DT = 0;
}

