import archiver = require("archiver");
import * as fs from "fs";
import * as path from "path";
import { Config } from "../config";

const backuppath = path.resolve(Config.dataPath(), "../backup.zip");

import { Server, setWaitingForValue } from "..";
import { BackupData } from "./BackupData";
import { MessageWrapper } from "../MessageWrapper";
import { Sleep } from "../util/Sleep";
import { IntervalsExecution } from "../util/IntervalsExecution";
import { Scheduler } from "../util/Scheduler";

let data = new BackupData();

const datafilepath = path.resolve(Config.dataPath(), "backup.json");
const daysbetweenbackups = 2;
const whattimeofaday = 19;

export async function InitBackup()
{
  if (fs.existsSync(datafilepath)) {
    const file = fs.readFileSync(datafilepath);

    data = JSON.parse(file.toString()) as BackupData;

    console.log(`Read backup data.`);
  }
  else {
    console.log(`Created new datafile for backups.`);
    BackupSave();
  }

  Scheduler.Schedule(20, CreateBackup);
}

export async function BackupSave()
{
  const tdata = JSON.stringify(data);
  fs.writeFileSync(datafilepath, tdata);
}

export async function BackupCycle()
{
  /*const now = new Date(Date.now());
  const executed = await IntervalsExecution.Executed("backup");

  if (!executed && Math.abs(data.lastSend - now.getDate()) > daysbetweenbackups && now.getHours() >= whattimeofaday) {
    console.log(now + " backup time");
    CreateBackup();
    IntervalsExecution.Execute("backup");
  }*/
}

async function CreateBackup()
{
  const now = new Date(Date.now());

  if (Math.abs(data.lastSend - now.getDate()) <= daysbetweenbackups) {
    return;
  }

  data.lastSend = now.getDate();

  await MakeBackupArchive();

  await Sleep(1000);

  /* BotAPI.sendDocument(Config.DefaultChat, fs.createReadStream(backuppath), {
    disable_notification: true
  }); */

  // Server.SendMessage("Created backup");

  BackupSave();
}

async function MakeBackupArchive()
{
  const output = fs.createWriteStream(backuppath);
  const archive = archiver("zip");

  output.on("close", () =>
  {
    console.log(archive.pointer() + " total bytes");
  });

  archive.on("error", (err) =>
  {
    throw err;
  });

  archive.pipe(output);

  // append files from a directories into the archive
  archive.directory(Config.dataPath(), "data");

  await archive.finalize();
}

export async function ProcessBackup(message: MessageWrapper)
{
  if (message.checkRegex(/\/backup force/)) {
    await CreateBackup();
    return;
  }
  return false;
}
