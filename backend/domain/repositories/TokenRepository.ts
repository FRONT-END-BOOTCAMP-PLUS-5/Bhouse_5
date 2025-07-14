export interface DecodedToken {
  userId: string
  email: string
  roleId: string
  exp: number
}

export interface TokenRepository {
  verifyToken(token: string): DecodedToken | null
  extractTokenFromRequest(request: any): string | null
}
