export interface ProfileObject {
  _email: string;
  _dogName: string;
  _breed: string;
  _description: string;
  _ownerName: string;
  _imageLink: string;
}

export interface ShortProfile {
  dogName: string;
  breed: string;
  description: string;
  ownerName: string;
  imageLink: string;
}

export interface MatchProfile extends ShortProfile {
  email: string;
}

export class Profile {
  private _email: string;
  private _dogName: string;
  private _breed: string;
  private _description: string;
  private _ownerName: string;
  private _imageLink: string;

  constructor(
    email: string,
    dogName: string,
    breed: string,
    description: string,
    ownerName: string,
    imageLink: string
  ) {
    this._email = email;
    this._dogName = dogName;
    this._breed = breed;
    this._description = description;
    this._ownerName = ownerName;
    this._imageLink = imageLink;
  }

  get email(): string {
    return this._email;
  }

  get dogName(): string {
    return this._dogName;
  }

  get breed(): string {
    return this._breed;
  }

  get description(): string {
    return this._description;
  }

  get ownerName(): string {
    return this._ownerName;
  }

  get imageLink(): string {
    return this._imageLink;
  }

  get shortProfile(): ShortProfile {
    return {
      dogName: this._dogName,
      breed: this.breed,
      description: this.description,
      ownerName: this.ownerName,
      imageLink: this.imageLink,
    };
  }

  get matchProfile(): MatchProfile {
    return {
      ...this.shortProfile,
      email: this.email,
    };
  }

  static fromObject(obj: ProfileObject): Profile {
    return new Profile(
      obj._email,
      obj._dogName,
      obj._breed,
      obj._description,
      obj._ownerName,
      obj._imageLink
    );
  }
}
