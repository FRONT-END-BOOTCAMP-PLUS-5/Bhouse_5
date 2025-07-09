import { MenuSearchCriteria } from "./criteria/MenuSearchCriteria";
import { Menu } from "../entities/Menu";
import { MenuRelationsOptions } from "./options/MenuRelationsOptions";

export interface MenuRepository {
	// 조회 메소드들
	findAll(
		criteria: MenuSearchCriteria,
		relations?: MenuRelationsOptions
	): Promise<Menu[]>;
	findById(id: number, relations?: MenuRelationsOptions): Promise<Menu | null>;
	count(criteria: MenuSearchCriteria): Promise<number>;

	// 조작 메소드들
	save(menu: Menu): Promise<Menu>;
	update(menu: Menu): Promise<Menu>;
	delete(id: number): Promise<void>;
}
