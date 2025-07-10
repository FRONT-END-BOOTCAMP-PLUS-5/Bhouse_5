import { MenuDto } from "./GetMenuDto";

export class GetMenuListDto {
	constructor(
		public menus: MenuDto[],

		public currentPage: number,
		public endPage: number
	) {}
}
