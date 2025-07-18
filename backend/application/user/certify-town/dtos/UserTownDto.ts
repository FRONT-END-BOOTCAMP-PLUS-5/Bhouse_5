// /dto/UserTownDto.ts

export interface CreateUserTownDto {
  userId: string
  townName: string
  lat: number
  lng: number
}

export interface UserTownDto {
  id: number
  userId: string
  townName: string
  lat: number
  lng: number
  isPrimary: boolean
  createdAt: Date
}
