export interface ProfileObject {
  _username: string;
  _name: string;
  _breed: string;
  _description: string;
  _contact: string;
  _ownerName: string;
  _imageLink: string;
}

export interface ShortProfile {
  name: string;
  breed: string;
  description: string;
  ownerName: string;
  imageLink: string;
}

export interface MatchProfile {
  name: string;
  contact: string;
  imageLink: string;
}

export class Profile {
  private _username: string;
  private _name: string;
  private _breed: string;
  private _description: string;
  private _contact: string;
  private _ownerName: string;
  private _imageLink: string;

  constructor(
    username: string,
    name: string,
    breed: string,
    description: string,
    contact: string,
    ownerName: string,
    imageLink: string
  ) {
    this._username = username;
    this._name = name;
    this._breed = breed;
    this._description = description;
    this._contact = contact;
    this._ownerName = ownerName;
    this._imageLink = imageLink;
  }

  get username(): string {
    return this._username;
  }

  get name(): string {
    return this._name;
  }

  get breed(): string {
    return this._breed;
  }

  get description(): string {
    return this._description;
  }

  get contact(): string {
    return this._contact;
  }

  get ownerName(): string {
    return this._ownerName;
  }

  get imageLink(): string {
    return this._imageLink;
  }

  get shortProfile(): ShortProfile {
    return {
      name: this.name,
      breed: this.breed,
      description: this.description,
      ownerName: this.ownerName,
      imageLink: this.imageLink,
    };
  }

  get matchProfile(): MatchProfile {
    return {
      name: this.name,
      contact: this.contact,
      imageLink: this.imageLink,
    };
  }

  static fromObject(obj: ProfileObject): Profile {
    return new Profile(
      obj._username,
      obj._name,
      obj._breed,
      obj._description,
      obj._contact,
      obj._ownerName,
      obj._imageLink
    );
  }
}
