import { supabaseClient } from '@bUtils/supabaseClient';
import { AdRepository } from '../../domain/repositories/AdRepository';
import { Mapper } from '../mappers/Mapper';
import { ReadAdDto } from '@be/application/admin/ads/dtos/ReadAdDto';
import { CreateAdDto } from '@be/application/admin/ads/dtos/CreatedAdDto';
import { UpdateAdDto } from '@be/application/admin/ads/dtos/UpdateAdDto';
import { getCurrentUser, requireAdminUserId } from '@bUtils/constantfunctions';


export class AdRepositoryImpl implements AdRepository {
  // ✅ 모든 사용자 → 공개 광고만
  async findAll(): Promise<ReadAdDto[]> {
    // 현재 사용자 정보 조회 (로그인 안 되어도 null 반환 가능)
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    let isAdmin = false;

    if (user) {
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!userError && userData?.role === 'ADMIN') {
        isAdmin = true;
      }
    }

    const query = supabaseClient.from('ad_management').select('*');

    if (!isAdmin) {
      query.eq('is_active', true); // ✅ 일반 사용자 → 공개된 광고만
    }

    const { data, error } = await query;
    if (error || !data) throw error;

    return data.map(Mapper.toReadAdDto);
  }

  // ✅ 광고가 공개면 누구나 가능, 비공개면 ADMIN만
  async findById(id: number): Promise<ReadAdDto | null> {
    const { data, error } = await supabaseClient
      .from('ad_management')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    if (!data.is_active) {
      // 비공개 광고 → ADMIN만 가능
      const user = await getCurrentUser();
      if (!user) throw new Error('비공개 광고는 관리자만 조회할 수 있습니다.');

      const { data: userData, error: roleError } = await supabaseClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (roleError || !userData || userData.role !== 'ADMIN') {
        throw new Error('비공개 광고는 관리자만 조회할 수 있습니다.');
      }
    }

    return Mapper.toReadAdDto(data);
  }

  async create(dto: CreateAdDto): Promise<void> {
    const userId = await requireAdminUserId();

    const tableRow = {
      title: dto.title,
      img_url: dto.imageUrl,
      redirect_url: dto.redirectUrl,
      is_active: dto.isActive,
      type: dto.type,
      user_id: userId,
    };

    const { error } = await supabaseClient.from('ad_management').insert(tableRow);
    if (error) throw error;
  }

  async update(id: number, dto: UpdateAdDto): Promise<void> {
    await requireAdminUserId();

    const updateFields: Partial<{
      title: string;
      img_url: string;
      redirect_url: string;
      is_active: boolean;
      type: string;
    }> = {};

    if (dto.title !== undefined) updateFields.title = dto.title;
    if (dto.imageUrl !== undefined) updateFields.img_url = dto.imageUrl;
    if (dto.redirectUrl !== undefined) updateFields.redirect_url = dto.redirectUrl;
    if (dto.isActive !== undefined) updateFields.is_active = dto.isActive;
    if (dto.type !== undefined) updateFields.type = dto.type;

    const { error } = await supabaseClient
      .from('ad_management')
      .update(updateFields)
      .eq('id', id);
    if (error) throw error;
  }

  async delete(id: number): Promise<void> {
    await requireAdminUserId();
    const { error } = await supabaseClient.from('ad_management').delete().eq('id', id);
    if (error) throw error;
  }
}
