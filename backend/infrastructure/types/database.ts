/**
 * 데이터베이스 테이블 스키마 타입 정의
 * 모든 테이블의 컬럼과 관계를 중앙화하여 관리
 */

export interface RoleTable {
  role_id: number // bigint
  name: string // varchar(50)
  // 관계
  user_roles?: UserRoleTable[]
}

export interface UserTable {
  user_id: string // uuid
  username: string // varchar(50)
  email: string // varchar(100)
  password?: string | null // varchar(255) | null
  created_at: Date // timestamp
  updated_at: Date // timestamptz
  nickname?: string | null // varchar(50) | null
  phone?: string | null // varchar(20) | null
  profile_img_url?: string | null // text | null
  provider: string // varchar
  provider_id?: string | null // varchar | null
  // 관계
  user_roles?: UserRoleTable[]
  alarms?: AlarmTable[]
}

export interface UserRoleTable {
  user_id: string // uuid (FK: users.user_id)
  role_id: number // bigint (FK: roles.role_id)
  // 관계
  user?: UserTable
  role?: RoleTable
}

export type AlarmTypeEnum = 'KEYWORD' | 'REPLY' | 'ADMIN'

export interface AlarmTable {
  alarm_id: number // bigint
  user_id: string // uuid (FK: users.user_id)
  message: string // text
  is_read: boolean // boolean
  created_at: Date // timestamp
  alarm_type: AlarmTypeEnum // enum
  // 관계
  user?: UserTable
}

export interface AdTable {
  created_at: string | number | Date
  id: number // int4
  user_id: string
  title: string // varchar(100)
  img_url: string // varchar(255)
  redirect_url: string // varchar(255)
  is_active: boolean // bool
  type: string // varchar(20)
}

export interface BoardgameTable {
  boardgame_id: number // bigint
  name: string // character varying(100)
  description: string | null // text
  min_players: number | null // integer
  max_players: number | null // integer
  created_by: string // uuid
  created_at: string // timestamp without time zone (ISO string으로 처리)
  updated_at: string // timestamp with time zone (ISO string으로 처리)
  updated_by: string // uuid
  min_playtime: number | null // integer
  max_playtime: number | null // integer
  difficulty: number | null // real (TypeScript에서는 number)
  genre_id: number // bigint
  img_url: string | null // text
  // 관계 (필요시 추가)
  creator?: UserTable // created_by와 연결된 User
  updater?: UserTable // updated_by와 연결된 User
  genre?: BoardgameGenreTable // genre_id와 연결된 BoardgameGenre
}

/**
 * `boardgame_genres` 테이블 스키마 타입 정의
 */
export interface BoardgameGenreTable {
  id: number // bigint
  name: string | null // text
  // 관계 (필요시 추가)
  boardgames?: BoardgameTable[] // 해당 장르에 속하는 보드게임들
}

export interface UserCommunityAlarmKeywordTable {
  keyword_id: number // bigint
  created_at: string // timestamp with time zone (ISO string으로 처리)
  user_id: string // uuid
  keyword: string | null // character varying null (스키마에 따라 null 허용)
}

export interface UserSettingTable {
  keyword_alarm: boolean
  reply_alarm: boolean
  user_id: string // uuid (Primary Key)
}

export interface UserTownTable {
  id: number
  user_id: string
  town_name: string
  latitude: number | null
  longitude: number | null
  created_at: Date // 또는 Date (string인 경우 new Date()로 변환)
}

export interface StoreTable {
  store_id: number | undefined
  name: string
  address: string
  phone: string
  description: string
  image_place_url: string
  image_menu_url: string
  created_by: string
  open_time: string
}

export interface CommunityPostTable {
  post_id: number // bigint
  user_id: string // uuid
  title: string // character varying(200)
  content: string // text
  created_at: string // timestamp without time zone (ISO string으로 처리)
  updated_at: string // timestamp without time zone (ISO string으로 처리)
  category_id: number // bigint
  town: string | null // text
  hits: number // bigint
  // 관계 (필요시 추가)
  // category_name: string; // JOIN을 통해 가져올 카테고리 이름
}

export interface CommunityCategoryTable {
  id: number // bigint
  name: string // text
}

export interface CommunityReplyTable {
  reply_id: number // bigint
  post_id: number // bigint
  user_id: string // uuid
  content: string // text
  parent_reply_id: number | null // bigint null
  created_at: string // timestamp without time zone (ISO string으로 처리)
  updated_at: string // timestamp without time zone (ISO string으로 처리)
}
