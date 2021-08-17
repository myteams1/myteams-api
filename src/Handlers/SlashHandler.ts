import { glob } from 'glob';
import { promisify } from 'util';
import { Client } from 'discord.js';
import { MyTeamsError } from '../Utils/Error';

const globPromise = promisify(glob);

export async function RegisterSlash(client: Client, folderName: string, Collection, guild: string) {
  if (!folderName) throw new MyTeamsError("A folder name its required.");
  if (!client) throw new MyTeamsError("Please provide a Client");
  if (!Collection) throw new MyTeamsError("Please provide a Discord.Collection");

  const slashCommands = await globPromise(
    `${process.cwd()}/${folderName}/*/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if(!file?.name) return;
    Collection.set(file.name, file);
    arrayOfSlashCommands.push(file);
  });

  client.on('ready', async() => {
    if(guild) {
      await client.guilds.cache.get(guild).commands.set(arrayOfSlashCommands);
    } else {
      client.application.commands.set(arrayOfSlashCommands)
    }
  })
}