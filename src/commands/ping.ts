import { Command } from "@sapphire/framework";
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { Embed, EmbedBuilder, Message } from "discord.js";

export class PingCommand extends Command {
  public constructor(ctx: Command.LoaderContext, options: Command.Options) {
    super(ctx, {...options});
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('ping').setDescription('Ping bot to see if it is alive')
    );
    }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const ping = await interaction.reply({content: "Ping?", ephemeral: true, fetchReply: true})

    if (isMessageInstance(ping)) {
      const bot_latency = Math.round(this.container.client.ws.ping);
      const api_latency = ping.createdTimestamp - interaction.createdTimestamp;
      
      const content = new EmbedBuilder()
      .setTitle("Pong!")
      .setDescription(`Bot Latency: ${bot_latency}ms.
      API Latency: ${api_latency}ms`);
      
      return interaction.editReply({ content: "", embeds: [content] });
    }

    return interaction.editReply('Failed to retrieve ping :(')
  }
}