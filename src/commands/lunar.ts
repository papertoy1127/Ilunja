import { Command } from "@sapphire/framework";
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { Embed, EmbedBuilder, Message } from "discord.js";
import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplyOptions } from '@sapphire/decorators';
import '@sapphire/decorators'
import { LunPhInfo, LunarPhase } from "../utils/lunphinfo";

@ApplyOptions<Subcommand.Options>({
	subcommands: [
		{
			name: 'today',
			chatInputRun: 'chatInputToday',
		},
		{
			name: 'date',
			chatInputRun: 'chatInputDate',
		}
	]
})
export class LunarCommand extends Subcommand {
    lunarCache: Map<string, LunarPhase>;

    public constructor(ctx: Command.LoaderContext, options: Command.Options) {
        super(ctx, {...options});
        this.lunarCache = new Map<string, LunarPhase>()
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
          builder
            .setName('lunar')
            .setDescription('Lunar Phase Command')
            .addSubcommand(cmd => 
                cmd
                .setName('today')
                .setDescription('Today\'s lunar phase')
            )
            .addSubcommand(cmd => 
                cmd
                .setName('date')
                .setDescription('Lunar phase of a specific date')
                .addNumberOption(o => o.setName('year').setDescription("year of the date").setRequired(true))
                .addNumberOption(o => o.setName('month').setMinValue(1).setMaxValue(12).setDescription("month of the date").setRequired(true))
                .addNumberOption(o => o.setName('day').setMinValue(1).setMaxValue(31).setDescription("day of the date").setRequired(true))
            )
        )
      }

      public async chatInputToday(interaction: Subcommand.ChatInputCommandInteraction) {
          const date = new Date();
          const res = await this.getLunar(date.getFullYear(), date.getMonth(), date.getDay());
                      
          const content = new EmbedBuilder()
          .setTitle("Lunar Phase")
          .setFields([
              {name: "Lunar Age", value: res!.lunAge.toString()},
              {name: "Day of the Week", value: res.solWeek?.toString() ?? "??"},
          ])
  
          return interaction.reply({embeds: [content], ephemeral: false})
      }

      public async chatInputDate(interaction: Subcommand.ChatInputCommandInteraction) {
          const date = new Date();
          const res = await this.getLunar(interaction.options.getNumber('year')!, interaction.options.getNumber('month')!, interaction.options.getNumber('day')!);
                      
          const content = new EmbedBuilder()
          .setTitle("Lunar Phase")
          .setFields([
              {name: "Lunar Age", value: res!.lunAge.toString()},
              {name: "Day of the Week", value: res.solWeek?.toString() ?? "??"},
          ])
  
          return interaction.reply({embeds: [content], ephemeral: false})
      }

    public async getLunar(year: number, month: number, day: number) : Promise<LunarPhase> {
        const id = `${year}${month.toString().padStart(2, '0')}${day.toString().padEnd(2, '0')}`;
        if (this.lunarCache.has(id)) {
            return this.lunarCache.get(id)!
        }

        const result = await LunPhInfo(year, month, day);
        this.lunarCache.set(id, result)
        return result
    }
}