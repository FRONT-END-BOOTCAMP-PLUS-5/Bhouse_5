import { Role } from './Role'

export class UserRole {
  constructor(
    public roles: Role, // N:1
  ) {}
}
