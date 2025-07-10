import { Menu } from './Menu'

export class Category {
  constructor(
    public id: number,
    public name: string,
    public isPublic: boolean,
    public createdAt: Date,
    public order: number,
    public menus?: Menu[], // 1:N 관계
  ) {}
}
