import { supabaseClient } from '@bUtils/supabaseClient';
import { Mapper } from '../mappers/Mapper';
import {
  StoreRepository,
  StoreSearchParams,
} from '@be/domain/repositories/StoreRepository';
import { StoreTable } from '../types/database';
import {
  getCurrentUserId,
  getCurrentUserRole,
} from '@bUtils/constantfunctions';
import { ReadStoreDto } from '@be/application/owner/stores/dtos/ReadStoreDto';
import { CreateStoreDto } from '@be/application/owner/stores/dtos/CreatedStoreDto';
import { UpdateStoreDto } from '@be/application/owner/stores/dtos/UpdateStoreDto';

// Supabase Row + Joined Users
interface StoreWithUser extends Omit<StoreTable, 'created_by'> {
  created_by: string;
  users: { username: string }[] | null;
}

export class StoreRepositoryImpl implements StoreRepository {
  async findAll(): Promise<ReadStoreDto[]> {
    const { data, error } = await supabaseClient
      .from('store_places')
      .select(`
        store_id, name, address, phone, description,
        image_place_url, image_menu_url, created_by, open_time,
        users:created_by (username)
      `);

    if (error) throw error;
    return data ? data.map(Mapper.toReadStoreDtoFromTableRow) : [];
  }

  async findById(id: number): Promise<ReadStoreDto | null> {
    const { data, error } = await supabaseClient
      .from('store_places')
      .select(`
        store_id, name, address, phone, description,
        image_place_url, image_menu_url, created_by, open_time,
        users:created_by (username)
      `)
      .eq('store_id', id)
      .single();

    if (error) throw error;
    return data ? Mapper.toReadStoreDtoFromTableRow(data) : null;
  }

  async findByUserId(userId: string): Promise<ReadStoreDto[]> {
    const { data, error } = await supabaseClient
      .from('store_places')
      .select(`
        store_id, name, address, phone, description,
        image_place_url, image_menu_url, created_by, open_time,
        users:created_by (username)
      `)
      .eq('created_by', userId);

    if (error) throw error;
    return data ? data.map(Mapper.toReadStoreDtoFromTableRow) : [];
  }

  async findByKeyword(params: StoreSearchParams): Promise<ReadStoreDto[]> {
    let query = supabaseClient.from('store_places').select(`
      store_id, name, address, phone, description,
      image_place_url, image_menu_url, created_by, open_time,
      users:created_by (username)
    `);

    if (params.keyword) {
      query = query.ilike('name', `%${params.keyword}%`);
    }

    if (params.address) {
      query = query.ilike('address', `%${params.address}%`);
    }

    if (params.ownerName) {
      query = query.ilike('users.username', `%${params.ownerName}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return data ? data.map(Mapper.toReadStoreDtoFromTableRow) : [];
  }

  async create(dto: CreateStoreDto): Promise<void> {
    const userId = await getCurrentUserId();
    const tableRow = Mapper.toStoreTableFromCreate(dto, userId);
    const { error } = await supabaseClient
      .from('store_places')
      .insert(tableRow);
    if (error) throw error;
  }

  async update(
    id: number,
    createdBy: string,
    dto: UpdateStoreDto
  ): Promise<void> {
    const userId = await getCurrentUserId();
    const role = await getCurrentUserRole();

    if (role !== 'ADMIN' && userId !== createdBy) {
      throw new Error('매장을 수정할 권한이 없습니다.');
    }

    const updateTable = Mapper.toUpdateStoreTable(dto);
    const cleanUpdate = Object.fromEntries(
      Object.entries(updateTable).filter(([_, v]) => v !== undefined && v !== '')
    );

    const { error } = await supabaseClient
      .from('store_places')
      .update(cleanUpdate)
      .eq('store_id', id);

    if (error) throw error;
  }

  async delete(id: number): Promise<void> {
    const userId = await getCurrentUserId();
    const role = await getCurrentUserRole();

    const { data: store, error } = await supabaseClient
      .from('store_places')
      .select('created_by')
      .eq('store_id', id)
      .single();

    if (error || !store) {
      throw new Error('해당 매장을 찾을 수 없습니다.');
    }

    if (role !== 'ADMIN' && store.created_by !== userId) {
      throw new Error('매장을 삭제할 권한이 없습니다.');
    }

    const { error: deleteError } = await supabaseClient
      .from('store_places')
      .delete()
      .eq('store_id', id);

    if (deleteError) throw deleteError;
  }
}
