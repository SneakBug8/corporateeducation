export class ResponseTypes {
    public static Null = makeResponseType(0, "");
    public static NotAuthorized = makeResponseType(1, "You are not authorized");
    public static NoRights = makeResponseType(2, "You don't have rights for this action");
    public static NoSuchUser = makeResponseType(3, "No such user");
    public static NoSuchExercise = makeResponseType(4, "No such exercise");
    public static NotEligibleForTask = makeResponseType(5, "You are not eligible to do this task. Reason: ");
    public static NoSuchRun = makeResponseType(6, "No such run");
    public static NoSuchStep = makeResponseType(7, "No such step");

    public static AutoPass = makeResponseType(8, "Passed automatically");
    public static WrongAnswer = makeResponseType(9, "Wrong answer");
    public static CorrectAnswer = makeResponseType(10, "Correct answer");
    public static CollectedAnswer = makeResponseType(18, "Collected answer");
    public static ExcerciseFinished = makeResponseType(19, "ExcerciseFinished");
    public static OK = makeResponseType(20, "OK");

    public static PreviousNotDone = makeResponseType(11, "Previous exercises weren't completed");
    public static NoGroup = makeResponseType(12, "This task is available only to certain groups.");
    public static TaskEnded = makeResponseType(13, "This task was closed by the trainer");
    public static TaskNotOpened = makeResponseType(14, "This task wasn't opened by the trainer");
    public static TaskNotStarted = makeResponseType(15, "This task wasn't opened by the trainer");
    public static MoreThanMaxXP = makeResponseType(16, "You are not allowed to repeat this task as you've passed the threshold");
    public static NotEnoughXp = makeResponseType(17, "You didn't get enough XP to pass this task");
}

function makeResponseType(id: number, text: string) {
    return { id, text };
}