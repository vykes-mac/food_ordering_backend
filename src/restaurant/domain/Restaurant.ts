export default class Restaurant {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: string,
    public readonly rating: number,
    public readonly displayImageUrl: string,
    public readonly location: Location,
    public readonly address: Address
  ) {}
}

export class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly parish: string,
    public readonly zone: string
  ) {}
}

export class Location {
  constructor(
    public readonly longitude: number,
    public readonly latitude: number
  ) {}
}
