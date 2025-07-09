import { supabase } from 'backend/utils/supabaseClient';
import { Ad } from '../../domain/entities/Ad';
import { AdRepository } from '../../application/admin/ads/repositories/AdRepository';

function toSnakeCaseFields(data: any): any {
  const mapped: any = {};
  if (data.title !== undefined) mapped.title = data.title;
  if (data.imgUrl !== undefined) mapped.img_url = data.imgUrl;
  if (data.redirectUrl !== undefined) mapped.redirect_url = data.redirectUrl;
  if (data.isActive !== undefined) mapped.is_active = data.isActive;
  return mapped;
}

export class AdRepositoryImpl implements AdRepository {
  async findAll(): Promise<Ad[]> {
    const { data, error } = await supabase.from('ad_management').select('id, title, img_url, redirect_url, is_active, type');
    if (error) throw error;
    return data.map(d => new Ad(d.id, '', d.title, d.img_url, d.redirect_url, d.is_active, d.type));
  }

  async findById(id: number): Promise<Ad | null> {
    const { data, error } = await supabase
      .from('ad_management')
      .select('id, title, img_url, redirect_url, is_active, type')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data ? new Ad(data.id, '', data.title, data.img_url, data.redirect_url, data.is_active, data.type) : null;
  }


  async create(ad: Ad): Promise<void> {
    const { error } = await supabase.from('ad_management').insert({
      user_id: ad.userId,
      title: ad.title,
      img_url: ad.imgUrl,
      redirect_url: ad.redirectUrl,
      is_active: ad.isActive,
      type: ad.type
    });
    if (error) throw error;
  }


  async update(id: number, updateData: any): Promise<void> {
    const safeUpdateData = { ...updateData };
    delete safeUpdateData.userId;
    const mapped = toSnakeCaseFields(safeUpdateData);

    const { error } = await supabase
      .from('ad_management')
      .update(mapped)
      .eq('id', id);
    if (error) throw error;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('ad_management').delete().eq('id', id);
    if (error) throw error;
  }
}
