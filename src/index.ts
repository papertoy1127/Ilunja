import 'dotenv/config'
import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, REST, Routes } from 'discord.js';


export const client = new SapphireClient({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  loadMessageCommandListeners: true
});

/*
client.rest.setToken(process.env.TOKEN as string)
client.rest.put(Routes.applicationCommands("1215255393660436501"), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
*/

client.login(process.env.TOKEN as string);
