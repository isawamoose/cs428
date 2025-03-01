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
  private id: number;
  private name: string;
  private breed: string;
  private description: string;
  private contact: string;
  private ownerName: string;
  private imageLink: string;

  constructor(id: number, name: string, breed: string, description: string, contact: string, ownerName: string, imageLink: string) {
    this.id = id;
    this.name = name;
    this.breed = breed;
    this.description = description;
    this.contact = contact;
    this.ownerName = ownerName;
    this.imageLink = imageLink;
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
}
