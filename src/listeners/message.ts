import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { Message } from "discord.js";
import { data } from "../data";
import { UpdateChannel } from "../utils/sticky";

@ApplyOptions<Listener.Options>({
  event: Events.MessageCreate,
  enabled: true,
  once: false,
  name: "messageCreate",
})
export class MessageCreateEvent extends Listener {
  public async run(message: Message) {
    if (data.stickyMessages.has(message.channelId)) {
        const stickyChn = data.stickyMessages.get(message.channelId)!;
        if (stickyChn.messageId != message.id) await UpdateChannel(message.channelId)
    }
  }
}