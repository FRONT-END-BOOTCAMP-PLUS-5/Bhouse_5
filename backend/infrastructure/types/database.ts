/**
 * 데이터베이스 테이블 스키마 타입 정의
 * 모든 테이블의 컬럼과 관계를 중앙화하여 관리
 */

// // menu_images 테이블
// export interface MenuImageTable {
// 	id: number; // int8
// 	name: string; // varchar
// 	is_default: boolean; // bool
// 	menu_id: number; // int8 (FK: menus.id)
// 	// 관계
// 	menu?: MenuTable;
// }

export interface RoleTable {
	role_id: number; // bigint
	name: string; // varchar(50)
	// 관계
	user_roles?: UserRoleTable[];
}

export interface UserTable {
	user_id: string; // uuid
	username: string; // varchar(50)
	email: string; // varchar(100)
	password?: string | null; // varchar(255) | null
	created_at: Date; // timestamp
	updated_at: Date; // timestamptz
	nickname?: string | null; // varchar(50) | null
	phone?: string | null; // varchar(20) | null
	profile_img_url?: string | null; // text | null
	provider: string; // varchar
	provider_id?: string | null; // varchar | null
	// 관계
	user_roles?: UserRoleTable[];
	alarms?: AlarmTable[];
}

export interface UserRoleTable {
	user_id: string; // uuid (FK: users.user_id)
	role_id: number; // bigint (FK: roles.role_id)
	// 관계
	user?: UserTable;
	role?: RoleTable;
}

export type AlarmTypeEnum = '...' // 실제 enum 값에 맞게 수정 필요

export interface AlarmTable {
	alarm_id: number; // bigint
	user_id: string; // uuid (FK: users.user_id)
	message: string; // text
	is_read: boolean; // boolean
	created_at: Date; // timestamp
	alarm_type: AlarmTypeEnum; // enum
	// 관계
	user?: UserTable;
}