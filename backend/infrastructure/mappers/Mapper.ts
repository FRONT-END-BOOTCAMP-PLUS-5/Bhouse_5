import { UserRole } from "@be/domain/entities/UserRole";
import {
	AdTable,
	AlarmTable,
	RoleTable,
	UserRoleTable,
	UserTable,
} from "../types/database";
import { Ad } from "@be/domain/entities/Ad";
import { Alarm, AlarmType } from "@be/domain/entities/Alarms";
import User from "@be/domain/entities/User";
import Role from "@be/domain/entities/Role";

export class Mapper {
	static toAd(source: AdTable): Ad {
		return new Ad(
			source.id,
			source.user_id,
			source.title,
			source.img_url,
			source.redirect_url,
			source.is_active,
			source.type,
		);
	}

	static toAdTable(ad: Ad): AdTable {
		return {
			id: ad.id ?? 0, // Handle undefined case with default value
			user_id: ad.userId,
			title: ad.title,
			img_url: ad.imgUrl,
			redirect_url: ad.redirectUrl,
			is_active: ad.isActive,
			type: ad.type
		};
	}

	static toAlarm(source: AlarmTable): Alarm {
		return new Alarm(
			source.alarm_id,
			source.user_id,
			source.message,
			source.is_read,
			new Date(source.created_at),
			source.alarm_type as AlarmType,
		);
	}

	static toUser(source: UserTable): User {
		return new User(
			source.user_id,
			source.username,
			source.password || '',
			source.email,
			new Date(source.created_at),
			null, // deletedAt - not available in UserTable
			source.profile_img_url || null,
			new Date(source.updated_at),
			source.provider_id || null
		);
	}

	static toRole(source: RoleTable): Role {
		return new Role(source.role_id.toString(), source.name);
	}

	static toMemberRole(source: UserRoleTable): UserRole {
		return new UserRole(
			source.user_id,
			source.role_id,
		);
	}
}
