import { SupabaseClient } from '@supabase/supabase-js'
import { CategoryRepository } from '../../domain/repositories/CategoryRepository'
import { Category } from '../../domain/entities/Category'
import { CategoryRelationsOptions } from '../../domain/repositories/options/CategoryRelationsOptions'
import { Mapper } from '../mappers/Mapper'
import { CategoryTable } from '../types/database'

export class SbCategoryRepository implements CategoryRepository {
  constructor(private supabase: SupabaseClient) {}

  // 카테고리 전체 목록 조회
  async findAll(relations?: CategoryRelationsOptions): Promise<Category[]> {
    // === 1. 쿼리 빌드하기
    let query = null
    {
      const selectArr = ['*']
      // 관계 데이터 포함 옵션이 있으면 select에 추가
      if (relations?.includeMenus) {
        selectArr.push('menus(*)')
      }
      const selectStr = selectArr.join(', ')
      query = this.supabase.from('categories').select(selectStr)
    }

    // === 2. 쿼리 실행하기
    let result: CategoryTable[] | null = null
    {
      const { data, error } = await query
      if (error) throw new Error(error.message)
      result = (data ?? []) as unknown as CategoryTable[]
    }

    // === 3. 데이터 변환해서 담기
    const categories: Category[] = result.map((item) => Mapper.toCategory(item))
    // === 4. (관계 데이터 menus 등은 필요시 여기에 추가)
    return categories
  }

  // 카테고리 개수 조회 (필터링된 레코드 수)
  async count(): Promise<number> {
    // === 1. 쿼리 빌드하기
    const query = this.supabase.from('categories').select('*', { count: 'exact' })

    // === 2. 쿼리 실행 및 개수 반환
    const { count, error } = await query
    if (error) throw new Error(error.message)
    return count ?? 0
  }

  async findById(id: number, relations?: CategoryRelationsOptions): Promise<Category | null> {
    const selectArr = ['*']
    if (relations?.includeMenus) {
      selectArr.push('menus(*)')
    }
    const selectStr = selectArr.join(', ')
    const { data, error } = await this.supabase.from('categories').select(selectStr).eq('id', id).single()
    if (error) throw new Error(error.message)
    if (!data) return null
    return Mapper.toCategory(data as unknown as CategoryTable)
  }

  async save(category: Category): Promise<Category> {
    const { data, error } = await this.supabase
      .from('categories')
      .insert([
        {
          id: category.id,
          name: category.name,
          is_public: category.isPublic,
          created_at: category.createdAt.toISOString(),
          order: category.order,
        },
      ])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return Mapper.toCategory(data as unknown as CategoryTable)
  }

  async update(category: Category): Promise<Category> {
    const { data, error } = await this.supabase
      .from('categories')
      .update({
        id: category.id,
        name: category.name,
        isPublic: category.isPublic,
        createdAt: category.createdAt.toISOString(),
        order: category.order,
      })
      .eq('id', category.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return Mapper.toCategory(data as unknown as CategoryTable)
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.from('categories').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
