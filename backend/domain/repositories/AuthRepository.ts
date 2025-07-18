import { User } from '../entities/User'

export interface AuthRepository {
  signup(user: User, roleId: number): Promise<void>
  findByProvider(provider: string, providerId: string): Promise<User | null>
  findUser(email: string, username: string): Promise<User | null>
  findUserById(userId: string): Promise<User | null>
  emailFind(username: string, phone: string): Promise<User | null>
  passwordFind(username: string, email: string, phone: string): Promise<User | null>
  passwordReset(userId: string, hashedPassword: string): Promise<void>
}
