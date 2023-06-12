BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "ExerciseSchedules" (
	"id"	INTEGER UNIQUE,
	"groupId"	INTEGER,
	"exerciseId"	INTEGER,
	"startsDt"	INTEGER,
	"endsDt"	INTEGER,
	"maxTries"	INTEGER,
	"minExp"	INTEGER,
	"maxExp"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Groups" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Runs" (
	"id"	INTEGER UNIQUE,
	"userId"	INTEGER,
	"exerciseId"	INTEGER,
	"time"	INTEGER,
	"experience"	INTEGER,
	"data"	TEXT,
	"finished"	INTEGER,
	"step"	INTEGER,
	"trynumber"	INTEGER,
	"mistakes"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	"FINISHED_DT"	INTEGER,
	"RESTART_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "RunsHistory" (
	"id"	INTEGER UNIQUE,
	"userId"	INTEGER,
	"exerciseId"	INTEGER,
	"time"	INTEGER,
	"experience"	INTEGER,
	"data"	TEXT,
	"finished"	INTEGER,
	"step"	INTEGER,
	"trynumber"	INTEGER,
	"mistakes"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	"FINISHED_DT"	INTEGER,
	"RESTART_DT"	INTEGER,
	"userGroup"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Notifications" (
	"Id"	INTEGER UNIQUE,
	"userId"	INTEGER,
	"title"	TEXT,
	"text"	TEXT,
	"icon"	TEXT,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "ReceivedAchievements" (
	"id"	INTEGER UNIQUE,
	"userId"	INTEGER,
	"achievementId"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "ExerciseSteps" (
	"id"	INTEGER UNIQUE,
	"exercise"	INTEGER,
	"stepnumber"	INTEGER,
	"type"	INTEGER,
	"content"	TEXT,
	"correctAnswer"	TEXT,
	"experience"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "ExerciseStepAnswers" (
	"id"	INTEGER UNIQUE,
	"stepId"	INTEGER,
	"answer"	TEXT,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "ExerciseDependencies" (
	"id"	INTEGER UNIQUE,
	"exerciseId"	INTEGER,
	"prevExerciseId"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Exercises" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT,
	"public"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "UserExperienceHistory" (
	"id"	INTEGER UNIQUE,
	"userId"	INTEGER,
	"runsExperience"	INTEGER,
	"answersExperience"	INTEGER,
	"totalExperience"	INTEGER,
	"source"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Leagues" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT,
	"group"	INTEGER,
	"hasfinished"	INTEGER,
	"starts"	INTEGER,
	"ends"	INTEGER,
	"winner"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Achievements" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT,
	"icon"	TEXT,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Answers" (
	"id"	INTEGER UNIQUE,
	"userId"	INTEGER,
	"exerciseId"	INTEGER,
	"answer"	TEXT,
	"experience"	INTEGER,
	"maxexperience"	INTEGER,
	"marked"	INTEGER,
	"step"	INTEGER,
	"outdated"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Tokens" (
	"id"	INTEGER,
	"userId"	INTEGER,
	"token"	TEXT,
	"liveuntil"	INTEGER,
	"active"	INTEGER,
	"UPDATED_DT"	INTEGER,
	"MIS_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Feedback" (
	"id"	INTEGER UNIQUE,
	"rating"	INTEGER,
	"usefulMark"	INTEGER,
	"promoterScore"	INTEGER,
	"comment"	TEXT,
	"userId"	INTEGER,
	"exerciseId"	INTEGER,
	"UPDATED_DT"	INTEGER,
	"MIS_DT"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Users" (
	"id"	INTEGER UNIQUE,
	"username"	TEXT,
	"password"	TEXT,
	"role"	INTEGER,
	"group"	INTEGER,
	"email"	TEXT,
	"name"	TEXT,
	"company"	TEXT,
	"blocked"	INTEGER,
	"MIS_DT"	INTEGER,
	"UPDATED_DT"	INTEGER,
	"AUTHORIZED_DT"	INTEGER,
	"DEAUTHORIZED_DT"	INTEGER,
	"timeonline"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE UNIQUE INDEX IF NOT EXISTS "SchedulesIndex" ON "ExerciseSchedules" (
	"groupId"	DESC,
	"exerciseId"	DESC
);
COMMIT;
