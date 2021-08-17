import { Client } from "discord.js";
import { MyTeamsError } from "../Utils/Error";
import chalk from "chalk";

export class HelperClient {
  constructor(client: Client, token: string) {

    if (!client) throw new MyTeamsError("Please provide a client.");
    if (!token) throw new MyTeamsError("Please provide a token");

    client.on("ready", () =>
      this.Ready()
    );
    client.login(token);
  }

  public Ready(): void {
    console.log(chalk.green("MyTeams Helper Intialized successfully"));
  }
}
