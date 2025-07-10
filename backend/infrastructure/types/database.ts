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

export interface BoardgameTable {
  boardgame_id: number; // bigint
  name: string; // character varying(100)
  description: string | null; // text
  min_players: number | null; // integer
  max_players: number | null; // integer
  created_by: string; // uuid
  created_at: string; // timestamp without time zone (ISO string으로 처리)
  updated_at: string; // timestamp with time zone (ISO string으로 처리)
  updated_by: string; // uuid
  min_playtime: number | null; // integer
  max_playtime: number | null; // integer
  difficulty: number | null; // real (TypeScript에서는 number)
  genre_id: number; // bigint
  img_url: string | null; // text
  // 관계 (필요시 추가)
  creator?: UserTable; // created_by와 연결된 User
  updater?: UserTable; // updated_by와 연결된 User
  genre?: BoardgameGenreTable; // genre_id와 연결된 BoardgameGenre
}

/**
 * `boardgame_genres` 테이블 스키마 타입 정의
 */
export interface BoardgameGenreTable {
  id: number; // bigint
  name: string | null; // text
  // 관계 (필요시 추가)
  boardgames?: BoardgameTable[]; // 해당 장르에 속하는 보드게임들
}