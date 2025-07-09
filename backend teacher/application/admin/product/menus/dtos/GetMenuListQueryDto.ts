export class GetMenuListQueryDto {
	constructor(
		public page?: number | null,
		public categoryId?: string | null,
		public searchName?: string | null,
		public sortField?: string | null,
		public ascending?: boolean | null,
		public includeAll?: boolean | null
	) {}
}
