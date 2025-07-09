export class MenuSearchCriteria {
	constructor(
		public searchWord?: string,
		public categoryId?: number,
		public memberId?: string,
		public sortField: string = "createdAt", // 정렬 필드(createdAt, name 등)
		public ascending: boolean = false,
		public publicOnly: boolean = true, // 공개(isPublic=true) 데이터만 포함
		public offset: number = 0,
		public limit: number = 8
	) {}
}
