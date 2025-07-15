import { AdRepository } from '@be/domain/repositories/AdRepository'
import { supabaseClient } from '@bUtils/supabaseClient'
import { Mapper } from '../mappers/Mapper'
import { CreateAdDto } from '@be/application/admin/ads/dtos/CreatedAdDto'
import { ReadAdDto } from '@be/application/admin/ads/dtos/ReadAdDto'
import { UpdateAdDto } from '@be/application/admin/ads/dtos/UpdateAdDto'

export class AdRepositoryImpl implements AdRepository {
  async findAll(isAdmin: boolean): Promise<ReadAdDto[]> {
    const query = supabaseClient.from('ad_management').select('*')
    const { data, error } = isAdmin ? await query : await query.eq('is_active', true)

    if (error || !data) throw error
    return data.map((row) => Mapper.toReadAdDto(Mapper.fromAdTable(row)))
  }

  async findById(id: number): Promise<ReadAdDto | null> {
    const { data, error } = await supabaseClient.from('ad_management').select('*').eq('id', id).single()

    if (error) throw error
    if (!data) return null

    return Mapper.toReadAdDto(Mapper.fromAdTable(data))
  }

  async create(dto: CreateAdDto, userId: string): Promise<void> {
    const tableRow = {
      title: dto.title,
      img_url: dto.imageUrl,
      redirect_url: dto.redirectUrl,
      is_active: dto.isActive,
      type: dto.type,
      user_id: userId,
    }

    const { error } = await supabaseClient.from('ad_management').insert(tableRow)
    if (error) throw error
  }

  async update(id: number, dto: UpdateAdDto): Promise<void> {
    const updateFields: Partial<{
      title: string
      img_url: string
      redirect_url: string
      is_active: boolean
      type: string
    }> = {}

    if (dto.title !== undefined) updateFields.title = dto.title
    if (dto.imageUrl !== undefined) updateFields.img_url = dto.imageUrl
    if (dto.redirectUrl !== undefined) updateFields.redirect_url = dto.redirectUrl
    if (dto.isActive !== undefined) updateFields.is_active = dto.isActive
    if (dto.type !== undefined) updateFields.type = dto.type

    const { error } = await supabaseClient.from('ad_management').update(updateFields).eq('id', id)
    if (error) throw error
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabaseClient.from('ad_management').delete().eq('id', id)
    if (error) throw error
  }
}
