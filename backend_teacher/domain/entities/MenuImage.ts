import { Menu } from "./Menu";

export class MenuImage {
	constructor(
		public id?: number,
		public name?: string,
		public isDefault?: boolean,
		public menuId?: number,
		public menu?: Menu // N:1 관계
	) {}
}
