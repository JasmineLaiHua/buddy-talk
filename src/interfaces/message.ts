export interface IMessageResponse {
  userId: string;
  messageId: string;
  text: string;
  datetime: string;
}

export interface IMessage extends IMessageResponse {
  status: string;
  channelId: string;
}
