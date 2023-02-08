export enum ResponseTypes {
    Null = "",
    NotAuthorized = "You are not authorized",
    NoRights = "You don't have rights for this action",
    NoSuchUser = "No such user",
    NoSuchExercise = "No such exercise",
    NotEligibleForTask = "You are not eligible to do this task. Reason: ",
    NoSuchRun = "No such run",

    WrongAnswer = "Wrong answer",

    PreviousNotDone = "Previous exercises weren't completed",
    NoGroup = "This task is available only to certain groups.",
    TaskEnded = "This task was closed by the trainer",
    TaskNotOpened = "This task wasn't opened by the trainer",
    TaskNotStarted = "This task wasn't opened by the trainer",
    MoreThanMaxXP = "You are not allowed to repeat this task as you've passed the threshold",
    NotEnoughXp = "You didn't get enough XP to pass this task"
}