import { Command } from "@sapphire/framework";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplyOptions } from "@sapphire/decorators";
import { data } from "../data";
import { ResetChannel } from "../utils/sticky";

@ApplyOptions<Subcommand.Options>({
	subcommands: [
		{
			name: 'message',
			chatInputRun: 'chatInputMessage',
		},
		/*{
			name: 'embed',
			chatInputRun: 'chatInputEmbed',
		},*/
    {
      name: 'clear',
      chatInputRun: 'chatInputClear'
    }
	]
})
export class StickCommand extends Subcommand {
  public constructor(ctx: Command.LoaderContext, options: Command.Options) {
    super(ctx, {...options});
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
      .setName('stick')
      .setDescription('Sticky Message')
      .addSubcommand(cmd => 
        cmd
        .setName('message')
        .setDescription('Sticky message (normal)')
      )
      .addSubcommand(cmd => 
        cmd
        .setName('clear')
        .setDescription('Clear sticky message')
      )
    );
  }

  public async chatInputMessage(interaction: Command.ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
      .setCustomId(`sticky-normal:${interaction.channelId}`)
      .setTitle('Set Sticky Message')
      .addComponents([
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('sticky-normal-content')
            .setLabel('Sticky Message')
            .setStyle(TextInputStyle.Paragraph)
        )
      ])

    await interaction.showModal(modal)
  }

  public async chatInputClear(interaction: Command.ChatInputCommandInteraction) {
    if (data.stickyMessages.has(interaction.channelId)) {
      ResetChannel(interaction.channelId);
      interaction.reply({ content: "이 채널의 하단 고정 메시지를 삭제했습니다.", ephemeral: true })
    } else {
      interaction.reply({ content: "이 채널에 하단 고정 메시지가 없습니다.", ephemeral: true })
    }
  }
}