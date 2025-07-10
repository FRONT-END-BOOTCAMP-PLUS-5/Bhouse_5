import { SupabaseClient } from '@supabase/supabase-js'
import { MemberRepository } from '../../domain/repositories/MemberRepository'
import { Member } from '../../domain/entities/Member'
import { Mapper } from '../mappers/Mapper'
import { MemberTable } from '../types/database'

export class SbMemberRepository implements MemberRepository {
  constructor(private supabase: SupabaseClient) {}

  // 멤버 전체 목록 조회
  async findAll(): Promise<Member[]> {
    // === 1. 쿼리 빌드하기
    const query = this.supabase.from('members').select('*')

    // === 2. 쿼리 실행하기
    let result: MemberTable[] | null = null
    {
      const { data, error } = await query
      if (error) throw new Error(error.message)
      result = (data ?? []) as unknown as MemberTable[]
    }

    // === 3. 데이터 변환해서 담기
    const members: Member[] = result.map((item) => Mapper.toMember(item))
    return members
  }

  // 멤버 개수 조회 (필터링된 레코드 수)
  async count(): Promise<number> {
    // === 1. 쿼리 빌드하기
    const query = this.supabase.from('members').select('*', { count: 'exact' })

    // === 2. 쿼리 실행 및 개수 반환
    const { count, error } = await query
    if (error) throw new Error(error.message)
    return count ?? 0
  }

  // 멤버 단건 조회
  async findById(id: string): Promise<Member | null> {
    const { data, error } = await this.supabase.from('members').select('*').eq('id', id).single()
    if (error) throw new Error(error.message)
    if (!data) return null
    return Mapper.toMember(data as unknown as MemberTable)
  }

  // 멤버 저장
  async save(member: Member): Promise<Member> {
    const { data, error } = await this.supabase
      .from('members')
      .insert([
        {
          id: member.id,
          username: member.username,
          password: member.password,
          email: member.email,
          created_at: member.createdAt.toISOString(),
          deleted_at: member.deletedAt ? member.deletedAt.toISOString() : null,
          image: member.image,
          updated_at: member.updatedAt ? member.updatedAt.toISOString() : null,
        },
      ])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return Mapper.toMember(data as unknown as MemberTable)
  }

  // 멤버 수정
  async update(member: Member): Promise<Member> {
    const { data, error } = await this.supabase
      .from('members')
      .update({
        id: member.id,
        username: member.username,
        password: member.password,
        email: member.email,
        created_at: member.createdAt.toISOString(),
        deleted_at: member.deletedAt ? member.deletedAt.toISOString() : null,
        image: member.image,
        updated_at: member.updatedAt ? member.updatedAt.toISOString() : null,
      })
      .eq('id', member.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return Mapper.toMember(data as unknown as MemberTable)
  }

  // 멤버 삭제
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('members').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
