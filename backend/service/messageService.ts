import { Message } from "@shared/Message";
import { Database } from "../database/Database";
import { Conversation } from "@shared/Conversation";

export class MessageService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async addMessage(message: Message): Promise<boolean> {
    const messageAddSuccess: boolean = await this.db.addMessage(message);
    return messageAddSuccess;
  }

  async getConversation(
    userEmail: string,
    matchEmail: string
  ): Promise<Conversation> {
    const conversationId: number = await this.db.getConversationId(
      userEmail,
      matchEmail
    );
    const conversation: Conversation = await this.db.getConversation(
      conversationId
    );
    return conversation;
  }
}
