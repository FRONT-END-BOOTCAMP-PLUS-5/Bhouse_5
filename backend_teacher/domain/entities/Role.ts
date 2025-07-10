import { MemberRole } from "./MemberRole";
import { Member } from "./Member";

export class Role {
	constructor(
		public id: number,
		public name: string,
		public createdAt: Date,
		public memberRoles?: MemberRole[], // 1:N
		public members?: Member[] // N:M (간접)
	) {}
}
