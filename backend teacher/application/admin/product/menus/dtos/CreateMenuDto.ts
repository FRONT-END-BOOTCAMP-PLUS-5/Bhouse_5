export interface CreateMenuDto {
	categoryId: number;
	korName: string;
	engName: string;
	price: number;
	description?: string;
	defaultImage?: string | File | null;
}
