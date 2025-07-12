export class Store {
  constructor(
    public storeId: number, // store_id: int8
    public name: string, // name: varchar
    public address: string, // address: varchar
    public phone?: string, // phone: varchar (optional)
    public description?: string, // description: text (optional)
    public createdBy?: string, // created_by: uuid (optional)
    public createdAt?: Date, // created_at: timestamp (optional)
    public imagePlaceUrl?: string, // image_place_url: varchar (optional)
    public imageMenuUrl?: string, // image_menu_url: varchar (optional)
    public openTime?: string, // open_time: text (optional)
  ) {}
}
