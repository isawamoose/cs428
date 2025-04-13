//this whole page was added by John. Don't be afraid to change something if you need to

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
    friendEmail: string,
    message: string,
    myEmail: string
  ) {
    try {
      console.log("In Message service");
      await apiClient.sendMessage(friendEmail, message, myEmail);
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
