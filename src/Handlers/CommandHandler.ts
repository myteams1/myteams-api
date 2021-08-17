import { Client } from "discord.js";
import fs from "fs";
import chalk from 'chalk';
import { MyTeamsError } from "../Utils/Error";

export function RegisterCommand(
  path: string,
  client: Client,
  log: boolean,
  Collection
) {
  if (!path) throw new MyTeamsError("A path its required.");
  if (!client) throw new MyTeamsError("Please provide a Client");
  if (!Collection) throw new MyTeamsError("Please provide a Discord.Collection");
  fs.readdir(path, (err, folders) => {
    if (err) throw err;
    for (const folder of folders) {
      fs.readdir(`${path}/${folder}`, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          const command = require(`${path}/${folder}/${file}`);
          Collection.set(command.name, command);
          if (log) {
            console.log(chalk.green(`${command.name} loaded successfully.`));
          } else {
            return;
          }
        }
      });
    }
  });
}
