interface IlunjaData {
  stickyMessages: Map<string, StickyChannelData>
}

interface StickyChannelData {
  messageId: string | undefined;
  content: MessageData | EmbedData;
}

export class MessageData {
  content: string

  constructor(content: string) {
    this.content = content;
  }
}

export class EmbedData {
  
}

export const data: IlunjaData = {
  stickyMessages: new Map<string, StickyChannelData>()
}