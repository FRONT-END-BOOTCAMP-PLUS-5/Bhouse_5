/**
 * 데이터베이스 테이블 스키마 타입 정의
 * 모든 테이블의 컬럼과 관계를 중앙화하여 관리
 */

// menu_images 테이블
export interface MenuImageTable {
	id: number; // int8
	name: string; // varchar
	is_default: boolean; // bool
	menu_id: number; // int8 (FK: menus.id)
	// 관계
	menu?: MenuTable;
}

// menus 테이블
export interface MenuTable {
	id: number; // int8
	kor_name: string; // varchar
	eng_name: string; // varchar
	price: number; // int2
	has_ice: boolean; // bool
	created_at: string; // timestamptz
	updated_at: string | null; // timestamptz
	deleted_at: string | null; // timestamptz
	member_id: string; // uuid (FK: members.id)
	category_id: number; // int8 (FK: categories.id)
	description: string | null; // text
	is_public: boolean; // bool
	// 관계
	images?: MenuImageTable[];
	member?: MemberTable;
	category?: CategoryTable;
}

// categories 테이블
export interface CategoryTable {
	id: number; // int8
	name: string; // varchar
	is_public: boolean; // bool
	created_at: string; // timestamptz
	order: number; // int4
	// 관계
	menus?: MenuTable[];
}

// members 테이블
export interface MemberTable {
	id: string; // uuid
	username?: string; // varchar
	password?: string; // varchar
	email?: string; // varchar
	created_at?: string; // timestamptz
	deleted_at?: string | null; // timestamptz
	image?: string | null; // varchar
	updated_at?: string | null; // timestamptz
	// 관계
	menus?: MenuTable[];
	member_roles?: MemberRoleTable[];
	roles?: RoleTable[];
}

// roles 테이블
export interface RoleTable {
	id: number; // int4
	name: string; // varchar
	created_at: string; // timestamptz
	// 관계
	member_roles?: MemberRoleTable[];
	members?: MemberTable[];
}

// member_roles 테이블
export interface MemberRoleTable {
	member_id: string; // uuid (PK, FK: members.id)
	role_id: number; // int4 (PK, FK: roles.id)
	created_at: string; // timestamptz
	// 관계
	member?: MemberTable;
	role?: RoleTable;
}
