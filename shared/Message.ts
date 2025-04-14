export class Message {
  private _senderEmail: string;
  private _recipientEmail: string;
  private _messageText: string;
  private _timestamp: string;

  constructor(
    senderEmail: string,
    recipientEmail: string,
    messageText: string,
    timestamp: string = new Date().toISOString()
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

  get timestamp(): string {
    return this._timestamp;
  }

  static fromJson(json: any): Message {
    return new Message(
      json._senderEmail,
      json._recipientEmail,
      json._messageText,
      json._timestamp
    );
  }
}
