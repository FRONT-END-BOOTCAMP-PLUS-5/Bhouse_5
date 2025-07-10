import { SupabaseClient } from '@supabase/supabase-js'
import { MenuImageRepository } from '../../domain/repositories/MenuImageRepository'
import { MenuImage } from '../../domain/entities/MenuImage'
import { Mapper } from '../mappers/Mapper'
import { MenuImageTable } from '../types/database'

export class SbMenuImageRepository implements MenuImageRepository {
  constructor(private supabase: SupabaseClient) {}

  // 메뉴 이미지 전체 목록 조회
  async findAll(): Promise<MenuImage[]> {
    // === 1. 쿼리 빌드하기
    const query = this.supabase.from('menu_images').select('*')

    // === 2. 쿼리 실행하기
    let result: MenuImageTable[] | null = null
    {
      const { data, error } = await query
      if (error) throw new Error(error.message)
      result = (data ?? []) as unknown as MenuImageTable[]
    }

    // === 3. 데이터 변환해서 담기
    const images: MenuImage[] = result.map((item) => Mapper.toMenuImage(item))
    return images
  }

  // 메뉴 이미지 개수 조회 (필터링된 레코드 수)
  async count(): Promise<number> {
    // === 1. 쿼리 빌드하기
    const query = this.supabase.from('menu_images').select('*', { count: 'exact' })

    // === 2. 쿼리 실행 및 개수 반환
    const { count, error } = await query
    if (error) throw new Error(error.message)
    return count ?? 0
  }

  // 메뉴 이미지 단건 조회
  async findById(id: number): Promise<MenuImage | null> {
    const { data, error } = await this.supabase.from('menu_images').select('*').eq('id', id).single()
    if (error) throw new Error(error.message)
    if (!data) return null
    return Mapper.toMenuImage(data as unknown as MenuImageTable)
  }

  // 메뉴 이미지 저장
  async save(image: MenuImage): Promise<MenuImage> {
    const { data, error } = await this.supabase
      .from('menu_images')
      .insert([
        {
          id: image.id,
          name: image.name,
          is_default: image.isDefault,
          menu_id: image.menuId,
        },
      ])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return Mapper.toMenuImage(data as unknown as MenuImageTable)
  }

  // 메뉴 이미지 수정
  async update(image: MenuImage): Promise<MenuImage> {
    const { data, error } = await this.supabase
      .from('menu_images')
      .update({
        id: image.id,
        name: image.name,
        is_default: image.isDefault,
        menu_id: image.menuId,
      })
      .eq('id', image.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return Mapper.toMenuImage(data as unknown as MenuImageTable)
  }

  // 메뉴 이미지 삭제
  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.from('menu_images').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
