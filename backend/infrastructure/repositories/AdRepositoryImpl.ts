import { supabaseClient } from '@bUtils/supabaseClient';
import { Ad } from '../../domain/entities/Ad';
import { AdRepository } from '../../domain/repositories/AdRepository';
import { Mapper } from '../mappers/Mapper';

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) throw new Error("인증된 사용자 정보가 없습니다.");
  return user.id;
}

export class AdRepositoryImpl implements AdRepository {
  async findAll(): Promise<Ad[]> {
    const { data, error } = await supabaseClient.from('ad_management').select('id, title, img_url, redirect_url, is_active, type');
    if (error) throw error;
    return data.map(d => new Ad(d.id, '', d.title, d.img_url, d.redirect_url, d.is_active, d.type));
  }

  async findById(id: number): Promise<Ad | null> {
    const { data, error } = await supabaseClient
      .from('ad_management')
      .select('id, title, img_url, redirect_url, is_active, type')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data ? new Ad(data.id, '', data.title, data.img_url, data.redirect_url, data.is_active, data.type) : null;
  }

  async create(ad: Ad): Promise<void> {
    const userId = await getCurrentUserId();
    const adTable = Mapper.toAdTable({ ...ad, userId }); // userId 덮어쓰기
    const { error } = await supabaseClient.from("ad_management").insert(adTable);
    if (error) throw error;
  }

  async update(id: number, updateData: Partial<Ad>): Promise<void> {
    const partial = Mapper.toAdTable({ ...updateData, id } as Ad); // 임시로 Ad 형변환
    // user_id는 수정하지 않도록 제거 - destructuring을 사용하여 안전하게 제거
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...updateFields } = partial;
    const { error } = await supabaseClient.from("ad_management").update(updateFields).eq("id", id);
    if (error) throw error;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabaseClient.from('ad_management').delete().eq('id', id);
    if (error) throw error;
  }
}
