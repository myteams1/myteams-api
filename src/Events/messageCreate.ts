import { Client } from "discord.js";
import chalk from 'chalk';
import { MyTeamsError } from "../Utils/Error";

export async function MessageEvent(client: Client, prefix: string, Collection) {
    console.log(chalk.yellow('[MyTeams] (Warning) >> This event message its for our Command Handler, if you dont use our command Handler, please dont use this function or you will get many errors'));
    if(!client) throw new MyTeamsError('Please provide a client.');
    if(!prefix) throw new MyTeamsError('Please provide a prefix.');
    if(!Collection) throw new MyTeamsError('Please provide a command collection.')

    if(prefix.length > 3) throw new Error('The prefix must to be lower than 3 characters.');

    client.on('messageCreate', async(message) => {
        if(!message.content.startsWith(prefix)) return;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLocaleLowerCase();

        let cmd = Collection.get(command) || Collection.find((c) => c.alias.includes(command));
        if(!cmd) return;

        if(cmd) {
            cmd.run(client, message, args);
        }
    })
}