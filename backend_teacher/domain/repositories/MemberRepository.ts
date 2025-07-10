import { Member } from '../entities/Member'
import { MemberRelationsOptions } from './options/MemberRelationsOptions'

export interface MemberRepository {
  findAll(relations?: MemberRelationsOptions): Promise<Member[]>
  findById(id: string, relations?: MemberRelationsOptions): Promise<Member | null>
  save(member: Member): Promise<Member>
  update(member: Member): Promise<Member>
  delete(id: string): Promise<void>
}
