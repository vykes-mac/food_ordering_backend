export class Menu {
  constructor(
    public readonly id: string,
    public readonly restaurantId: string,
    public readonly name: string,
    public readonly imageUrl: string,
    public readonly description: string,
    public readonly items: Array<MenuItem>
  ) {}
}

export class MenuItem {
  constructor(
    public readonly id: string,
    public readonly menuId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly imageUrls: Array<string>,
    public readonly unitPrice: number
  ) {}
}
