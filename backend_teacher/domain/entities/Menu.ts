import { MenuImage } from './MenuImage'
import { Category } from './Category'
import { Member } from './Member'

export class Menu {
  constructor(
    public id?: number,
    public korName?: string,
    public engName?: string,
    public price?: number,
    public memberId?: string,
    public categoryId?: number,
    public hasIce?: boolean,
    public createdAt?: Date,
    public isPublic?: boolean,
    public updatedAt?: Date | null,
    public deletedAt?: Date | null,
    public description?: string | null,
    // 관계가 있는 엔티티
    public menuImages?: MenuImage[],
    public category?: Category, // N:1
    public member?: Member, // N:1
  ) {}
}
