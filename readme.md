# MyTeams Helper.

A simple api to use discord.js easily.

## Client:

- The client to login with Discord.js.
- Parameters: client: Discord.Client, token: String.

```js
/**
 * @example Client example
 **/

const { HelperClient } = require("myteams"); 
const Discord = require("discord.js");
const client = new Discord.Client(); 

new HelperClient(client, "token here"); 
```

## Twitch Helper

- A twitch helper.
- Setting up The Client: Parameters:

* client_id: string //The application client_id.
* client_secret: string //The application client_secret. 

[WARNING] You should be logged in with your application or twitch will reject your request with errors like: Please check your client_id and client_secret.

```js
/**
 * @example Twitch Client example.
**/

const { TwitchHelper } = require('myteams-api');

const twitch = new TwitchHelper({
  client_id: 'Your client id here',
  client_secret: 'Your client secret here'
});
```

- Also our twitch helper has a function to get streams.
- Parameters:

* channel: string //The channel of twitch.

```js
/**
 * @example Twitch getter streams example
**/

const { TwitchHelper } = require('myteams-api');

const MyTeamsTwitch = new TwitchHelper({
  client_id: 'Your client id here',
  client_secret: 'Your client secret here'
});

async function getStream() {
  const streams = await MyTeamsTwitch.getStreams({ channel: 'Vegetta777' });
  console.log(streams);
}
```

## Command Handling:

- A CommandHandler with sub-folders.
- Parameters:

* path: string //The path of the folder.
* client: Client //Discord.js client.
* log: boolean //Log all commands if its true. Default: true.
* Collection: Discord.Collection //Discord collection for commands.

```js
/**
 * @example Handler Example
 **/

const Discord = require("discord.js");
const path = require("path");
const client = new Discord.Client({ intents: 32767 });
const myteams = require("myteams-api");
client.commands = new Discord.Collection();

myteams.RegisterCommand(
  path.join(__dirname, "./commands"),
  client,
  true,
  client.commands
);
```

## Message Event

- A message event for our Command Handler.
- Parameters: 

* client: Client //The discord.js client.
* prefix: string //The prefix of your bot.
* Collection: Discord.Collection //The collection of the commands.

```js
/**
 * @example Message Event example 
**/

const Discord = require('discord.js');
const path = require('path')
const client = new Discord.Client({ intents: 32767 });
const myteams = require('myteams-api');
client.commands = new Discord.Collection()

myteams.RegisterCommand(path.join(__dirname, './commands'), client, true, client.commands)
myteams.MessageEvent(client, 'm!', client.commands)

```

## Slash Command Handling

- A slash command handler.
- Parameters:

* client: Client //A Discord.js client.
* folderName: string //The name of the folder of slash commands.
* Collection: Discord.Collection //The Collection of the slash handler.
* guild< Optional >: The guild to deploy the slash, if there its no guild the deploy will be global. 

```js
/**
 * @example Slash Command Handling
 **/
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 32767 });
const myteams = require("myteams-api");
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();

myteams.RegisterSlash(
  client,
  "SlashCommands",
  client.slashCommands,
  "Guild id (optional) if doesnt have guild the deploy its glolal"
);
```

## Interaction Event

- A interaction event for our Slash Handler.
- Parameters: 

* client: Client //Discord.js Client
* collection: Discord.Collection //The collection of slash commands.

```js
/**
 * @example interactionCreate event
 **/

const Discord = require('discord.js');
const path = require('path')
const client = new Discord.Client({ intents: 32767 });
const myteams = require('myteams-api');
client.slashCommands = new Discord.Collection()

myteams.RegisterSlash(client, 'SlashCommands', client.slashCommands, '840075643286716429')
myteams.InteractionEvent(client, client.slashCommands);
```