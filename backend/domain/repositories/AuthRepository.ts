import { User } from '../entities/User'

export interface AuthRepository {
  signup(user: User, roleId: number): Promise<void>
  findByEmailOrUsername(email: string, username: string): Promise<User | null>
  findByProvider(provider: string, providerId: string): Promise<User | null>;
  signin(user: User): Promise<void>
  signout(): Promise<void>
  passwordFind(): Promise<User>
  passwordReset(user: User): Promise<void>
  emailFind(): Promise<User>
}
