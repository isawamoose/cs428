import { Message } from "./Message";

export class Conversation {
  private _id: number;
  private _messages: Message[];

  constructor(id: number, messages: Message[] = []) {
    this._id = id;
    this._messages = messages;
  }

  addMessage(message: Message) {
    this._messages.push(message);
    this._messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  setMessages(messages: Message[]) {
    this._messages = messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  get messages(): Message[] {
    return this._messages;
  }

  get id(): number {
    return this._id;
  }
}
