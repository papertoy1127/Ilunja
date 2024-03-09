import { Command } from "@sapphire/framework";

export class SevrerCountCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('servercount').setDescription('servercount.')
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const serverCount = interaction.client.guilds.cache.size;
    await interaction.reply(`The bot is in ${serverCount} servers.`);
  }
}