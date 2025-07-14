import { Menu } from "./Menu";
import { MemberRole } from "./MemberRole";
import { Role } from "./Role";

export class Member {
	constructor(
		public id: string,
		public username: string,
		public password: string,
		public email: string,
		public createdAt: Date,
		public deletedAt: Date | null,
		public image: string | null,
		public updatedAt: Date | null,
		public menus?: Menu[], // 1:N
		public memberRoles?: MemberRole[], // 1:N
		public roles?: Role[] // N:M (간접)
	) {}
}