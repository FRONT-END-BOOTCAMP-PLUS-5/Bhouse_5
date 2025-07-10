import { Member } from './Member'
import { Role } from './Role'

export class MemberRole {
  constructor(
    public memberId: string,
    public roleId: number,
    public createdAt: Date,
    public member?: Member, // N:1
    public role?: Role, // N:1
  ) {}
}
