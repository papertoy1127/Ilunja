import { Channel, Message, TextChannel } from "discord.js";
import { data } from "../data";
import { MessageData } from './../data';
import { client } from "..";

export async function ResetChannel(chnId: string) {
  const stickyChn = data.stickyMessages.get(chnId)!;
  if (stickyChn === undefined) return
  const chn = await client.channels.fetch(chnId);

  if (stickyChn.messageId !== undefined) {
    if (chn instanceof TextChannel) {
      const lastMsg = await chn.messages.fetch(stickyChn.messageId);
      console.log(lastMsg)
      await lastMsg.delete();
    }
    
    data.stickyMessages.delete(chnId);
  }
}

export async function UpdateChannel(chnId: string) {
  const chn = await client.channels.fetch(chnId) as TextChannel;
  const stickyChn = data.stickyMessages.get(chnId)!;
  if (stickyChn.content instanceof MessageData) {
    if (stickyChn.messageId !== undefined) {
      const lastMsg = await chn.messages.fetch(stickyChn.messageId);
      await lastMsg.delete();
    }

    const msg = await chn.send(stickyChn.content.content);
    stickyChn.messageId = msg.id;
  }
}