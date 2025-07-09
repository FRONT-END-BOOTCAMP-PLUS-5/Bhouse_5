import { supabase } from '@bUtils/supabaseClient';
import { AdRepository } from '../../application/out/port/out/AdRepository';
import { Ad } from '../../domain/model/Ad';

export class AdRepositoryImpl implements AdRepository {
  async findAll(): Promise<Ad[]> {
    const { data, error } = await supabase.from('ad_management').select('*');
    if (error) throw error;
    return data.map(d => new Ad(d.id, d.title, d.img_url, d.redirect_url, d.is_active));
  }

  async findById(id: number): Promise<Ad | null> {
    const { data, error } = await supabase.from('ad_management').select('*').eq('id', id).single();
    if (error) throw error;
    return data ? new Ad(data.id, data.title, data.img_url, data.redirect_url, data.is_active) : null;
  }

  async create(ad: Ad): Promise<void> {
    const { error } = await supabase.from('ad_management').insert({
      id: ad.id,
      title: ad.title,
      img_url: ad.imgUrl,
      redirect_url: ad.redirectUrl,
      is_active: ad.isActive
    });
    if (error) throw error;
  }

  async update(ad: Ad): Promise<void> {
    const { error } = await supabase.from('ad_management').update({
      title: ad.title,
      img_url: ad.imgUrl,
      redirect_url: ad.redirectUrl,
      is_active: ad.isActive
    }).eq('id', ad.id);
    if (error) throw error;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from('ad_management').delete().eq('id', id);
    if (error) throw error;
  }
}
