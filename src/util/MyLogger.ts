import * as winston from "winston";

export const MyLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "verbose",
      filename: "filelog-verbose.log",
    }),
    new winston.transports.File({
      level: "error",
      filename: "filelog-error.log",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  MyLogger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
