export class Message {
  private _senderEmail: string;
  private _recipientEmail: string;
  private _messageText: string;
  private _timestamp: Date;

  constructor(
    senderEmail: string,
    recipientEmail: string,
    messageText: string,
    timestamp: Date = new Date()
  ) {
    this._senderEmail = senderEmail;
    this._recipientEmail = recipientEmail;
    this._messageText = messageText;
    this._timestamp = timestamp;
  }

  get senderEmail(): string {
    return this._senderEmail;
  }

  get recipientEmail(): string {
    return this._recipientEmail;
  }

  get messageText(): string {
    return this._messageText;
  }

  get timestamp(): Date {
    return this._timestamp;
  }
}
