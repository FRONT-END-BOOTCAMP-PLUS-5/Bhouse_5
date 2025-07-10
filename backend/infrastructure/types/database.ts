/**
 * 데이터베이스 테이블 스키마 타입 정의
 * 모든 테이블의 컬럼과 관계를 중앙화하여 관리
 */

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

export type AlarmTypeEnum = 'KEYWORD' | 'REPLY' | 'ADMIN'

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

export interface AdTable {
	id: number; // int4
	user_id: string;
	title: string; // varchar(100)
	img_url: string; // varchar(255)
	redirect_url: string; // varchar(255)
	is_active: boolean; // bool
	type: string; // varchar(20)
}

export interface UserTownTable {
	id: number;
	user_id: string;
	town_name: string;
	latitude: number | null;
	longitude: number | null;
	created_at: Date; // 또는 Date (string인 경우 new Date()로 변환)
}

export interface StoreTable {
	store_id: number | undefined;
	name: string;
	address: string;
	phone: string;
	description: string;
	image_place_url: string;
	image_menu_url: string;
	created_by: string;
	open_time: string;
}