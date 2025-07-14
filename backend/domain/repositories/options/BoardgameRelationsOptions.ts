// backend/domain/repositories/options/BoardgameRelationsOptions.ts

export interface BoardgameRelationsOptions {
  includeCreator?: boolean // created_by (User) 포함 여부
  includeUpdater?: boolean // updated_by (User) 포함 여부
  includeGenre?: boolean // genre_id (BoardgameGenre) 포함 여부
}
