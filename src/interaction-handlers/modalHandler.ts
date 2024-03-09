import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { TextChannel, type ModalSubmitInteraction } from 'discord.js';
import { MessageData, data } from '../data';
import { ResetChannel, UpdateChannel } from '../utils/sticky';
import { client } from '..';

export class ModalHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.ModalSubmit
    });
  }

  public override parse(interaction: ModalSubmitInteraction) {
    const split = interaction.customId.split(':')
    const customId = split[0]
    const params = split.slice(1)

    console.log(split)
    if (customId == 'sticky-normal') {
      this.stickyNormal(interaction, params)
      return this.none();
    } else {
      return this.none();
    }

    return this.some();
  }

  public async run(interaction: ModalSubmitInteraction) {
    if (interaction.replied) return;
    const r = await interaction.deferReply({ephemeral: true, fetchReply: true})
    await interaction.deleteReply();
  }

  public async stickyNormal(interaction: ModalSubmitInteraction, params: string[]) {
    const chnId = params[0];
    const content = interaction.fields.getTextInputValue('sticky-normal-content')
    await ResetChannel(chnId);
    data.stickyMessages.set(chnId, {
      content: new MessageData(content),
      messageId: undefined,
    })
    await UpdateChannel(chnId);
    await interaction.reply({content:"하단 고정 메시지를 설정했습니다.", ephemeral: true})
  }
}