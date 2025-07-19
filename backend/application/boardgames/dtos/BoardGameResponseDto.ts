// backend/application/boardgames/dtos/BoardGameResponseDto.ts

export interface BoardGameResponseDto {
  id: number
  name: string
  min_players: number
  max_players: number
  img_url: string
  like_count: number // 새로 추가
}
