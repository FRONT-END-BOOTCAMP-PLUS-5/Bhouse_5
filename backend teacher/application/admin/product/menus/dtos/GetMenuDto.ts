export class MenuDto {
	constructor(
		public id: number,
		public korName: string,
		public engName: string,
		public price: number,
		public hasIce: boolean,
		public createdAt: Date,
		public isPublic: boolean,
		public memberId: string,
		public categoryId: number,
		public updatedAt: Date | null = null,
		public deletedAt: Date | null = null,
		public description: string | null = null,

		// 메뉴 기본 이미지 파일명
		public defaultImage: string | null = null
	) {}
}
