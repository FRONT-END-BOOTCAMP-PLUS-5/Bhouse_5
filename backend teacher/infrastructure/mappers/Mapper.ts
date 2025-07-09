import {
	MemberTable,
	CategoryTable,
	MenuTable,
	MenuImageTable,
	RoleTable,
	MemberRoleTable,
} from "../types/database";
import { Member } from "@/backend/domain/entities/Member";
import { Category } from "@/backend/domain/entities/Category";
import { Menu } from "@/backend/domain/entities/Menu";
import { MenuImage } from "@/backend/domain/entities/MenuImage";
import { Role } from "@/backend/domain/entities/Role";
import { MemberRole } from "@/backend/domain/entities/MemberRole";

export class Mapper {
	static toMember(source: MemberTable): Member {
		return new Member(
			source.id,
			source.username ?? "",
			source.password ?? "",
			source.email ?? "",
			source.created_at ? new Date(source.created_at) : new Date(),
			source.deleted_at ? new Date(source.deleted_at) : null,
			source.image ?? null,
			source.updated_at ? new Date(source.updated_at) : null
		);
	}

	static toCategory(source: CategoryTable): Category {
		return new Category(
			source.id,
			source.name,
			source.is_public,
			new Date(source.created_at),
			source.order
		);
	}

	static toMenu(source: MenuTable): Menu {
		return new Menu(
			source.id,
			source.kor_name,
			source.eng_name,
			source.price,
			source.member_id,
			source.category_id,
			source.has_ice,
			new Date(source.created_at),
			source.is_public
		);
	}

	static toMenuImage(source: MenuImageTable): MenuImage {
		return new MenuImage(
			source.id,
			source.name,
			source.is_default,
			source.menu_id
		);
	}

	static toRole(source: RoleTable): Role {
		return new Role(source.id, source.name, new Date(source.created_at));
	}

	static toMemberRole(source: MemberRoleTable): MemberRole {
		return new MemberRole(
			source.member_id,
			source.role_id,
			new Date(source.created_at)
		);
	}
}
