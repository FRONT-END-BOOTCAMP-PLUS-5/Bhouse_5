export interface StoreSearchParams {
  keyword?: string
  address?: string
  ownerName?: string
}

export class Store {
  constructor(
    public readonly storeId: number | undefined, // optional
    public readonly name: string,
    public address: string,
    public phone: string,
    public description: string,
    public imagePlaceUrl: string,
    public imageMenuUrl: string,
    public createdBy: string,
    public readonly ownerName: string,
    public openTime: string,
  ) {}
}
