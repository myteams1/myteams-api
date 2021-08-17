import { Client } from "discord.js";
import { MyTeamsError } from "../Utils/Error";
import chalk from "chalk";

export async function InteractionEvent(client: Client, Collection) {
    console.log(chalk.yellow("[MyTeams] (Warning) >> This interaction event its for our slash command handler, if you don't use our slash handler, please don't use this function or you will get many errors"));
    if(!client) throw new MyTeamsError('Please provide a Discord client.');
    if(!Collection) throw new MyTeamsError('Please provide a slash command collection.');

    client.on('interactionCreate', async(interaction) => {
        if(interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: false }).catch(() => {});

            const cmd = Collection.get(interaction.commandName);
            if(!cmd) {
                interaction.editReply({ content: "That command doesn't exists!" });
            }

            const args = [];

            for(let option of interaction.options.data) {
                if(option.type === 'SUB_COMMAND') {
                    if(option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if(x.value) args.push(x.value);
                    });
                } else if(option.value) args.push(option.value);
            }

            cmd.run(client, interaction, args);
        }
    })
}