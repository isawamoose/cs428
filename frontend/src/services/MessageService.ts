//this whole page was added by John. Don't be afraid to change something if you need to

import { Message } from "@shared/Message";
import { apiClient } from "../api/ApiClient";
import { Conversation } from "@shared/Conversation";

export class MessageService {
  private static _instance: MessageService;

  // Singleton instance
  public static get instance(): MessageService {
    if (!this._instance) {
      this._instance = new MessageService();
    }
    return this._instance;
  }

  private constructor() {}

  public async sendMessage(
    myEmail: string,
    friendEmail: string,
    message: string
  ): Promise<Conversation | null> {
    try {
      const newMessage = new Message(
        myEmail,
        friendEmail,
        message,
        new Date().toISOString()
      );
      const conversation = await apiClient.sendMessage(newMessage);
      return conversation;
    } catch (error: unknown) {
      console.error("Could not send message.", (error as Error).message);
      return null;
    }
  }

  public async getConversation(
    matchEmail: string
  ): Promise<Conversation | null> {
    try {
      const messages = await apiClient.getConversation(matchEmail);
      return messages;
    } catch (error: unknown) {
      console.error("Could not fetch conversation", (error as Error).message);
      return null;
    }
  }
}
