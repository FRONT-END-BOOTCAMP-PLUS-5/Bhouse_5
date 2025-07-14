import { UserRole } from '@be/domain/entities/UserRole'
import { AdTable, AlarmTable, RoleTable, UserRoleTable, UserTable, StoreTable } from '../types/database'
import { Ad } from '@be/domain/entities/Ad'
import { Alarm, AlarmType } from '@be/domain/entities/Alarm'
import { User } from '@be/domain/entities/User'
import { Role } from '@be/domain/entities/Role'
import { Store } from '@be/domain/entities/Store'
import { CreateAdDto } from '@be/application/admin/ads/dtos/CreatedAdDto'
import { ReadAdDto } from '@be/application/admin/ads/dtos/ReadAdDto'
import { CreateStoreDto } from '@be/application/owner/stores/dtos/CreatedStoreDto'
import { ReadStoreDto } from '@be/application/owner/stores/dtos/ReadStoreDto'
import { UpdateStoreDto } from '@be/application/owner/stores/dtos/UpdateStoreDto'

export class Mapper {
  static toStoreTableFromCreate(dto: CreateStoreDto, userId: string) {
    throw new Error('Method not implemented.')
  }
  static toAd(source: AdTable): Ad {
    return new Ad(
      source.id,
      source.user_id,
      source.title,
      source.img_url,
      source.redirect_url,
      source.is_active,
      new Date(source.created_at),
      source.type,
    )
  }

  static toAdTable(ad: Ad): AdTable {
    return {
      id: ad.id ?? 0, // Handle undefined case with default value
      user_id: ad.userId,
      title: ad.title,
      img_url: ad.imgUrl,
      redirect_url: ad.redirectUrl,
      is_active: ad.isActive,
      created_at: ad.createdAt,
      type: ad.type,
    }
  }

  static toAdEntity(dto: CreateAdDto): Ad {
    return new Ad(
      undefined, // id는 sequence로 supabase에서 자동 생성
      "", // userId - will be set by repository
      dto.title,
      dto.imageUrl,
      "", // redirectUrl - not provided in CreateAdDto
      true, // isActive - default to true for new ads
      new Date(),
      dto.type || "BANNER", // type - provide default if not specified
    );
  }

  static toReadAdDto(ad: Ad): ReadAdDto {
    return {
      id: ad.id?.toString() ?? '',
      title: ad.title,
      description: '', // Ad entity doesn't have description field, providing default empty string
      imageUrl: ad.imgUrl, // ✅ Entity의 imgUrl을 DTO의 imageUrl로 변환
      createdAt: ad.createdAt.toISOString(),
    };
  }

  static toAlarm(source: AlarmTable): Alarm {
    return new Alarm(
      source.alarm_id,
      source.user_id,
      source.message,
      source.is_read,
      new Date(source.created_at),
      source.alarm_type as AlarmType,
    )
  }

  static toUser(source: UserTable): User {
    return new User(
      source.user_id,
      source.username,
      source.password || '',
      source.email,
      source.nickname || '',
      new Date(source.created_at),
      null, // deletedAt - not available in UserTable
      source.profile_img_url || null,
      new Date(source.updated_at),
      undefined, // userRole - not available in UserTable
      undefined, // userAlarms - not available in UserTable
      source.phone || undefined,
      source.provider || undefined,
      source.provider_id || undefined,
    )
  }

  static toRole(source: RoleTable): Role {
    return new Role(source.role_id, source.name)
  }

  static toMemberRole(source: UserRoleTable): UserRole {
    return new UserRole(source.user_id, source.role_id)
  }

   static toStore(dto: CreateStoreDto): Store {
    return new Store(
      undefined,               // storeId: Supabase에서 자동 생성
      dto.name,
      dto.address,
      dto.phone,
      dto.description,
      dto.imagePlaceUrl,
      dto.imageMenuUrl,
      dto.createdBy,
      dto.ownerName,
      dto.openTime
    );
  }

  static toReadStoreDto(store: Store): ReadStoreDto {
    return {
      storeId: store.storeId ?? 0, // optional일 수 있으므로 fallback
      name: store.name,
      address: store.address,
      phone: store.phone,
      description: store.description,
      imagePlaceUrl: store.imagePlaceUrl,
      imageMenuUrl: store.imageMenuUrl,
      createdBy: store.createdBy,
      ownerName: store.ownerName,
      openTime: store.openTime,
    };
  }

  static toStoreTable(store: Store): StoreTable {
    return {
      store_id: store.storeId,
      name: store.name,
      address: store.address,
      phone: store.phone,
      description: store.description,
      image_place_url: store.imagePlaceUrl,
      image_menu_url: store.imageMenuUrl,
      created_by: store.createdBy,
      open_time: store.openTime,
    }
  }

   static toUpdateStoreTable(dto: UpdateStoreDto): any {
    return {
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      description: dto.description,
      image_place_url: dto.imagePlaceUrl,
      image_menu_url: dto.imageMenuUrl,
      open_time: dto.openTime,
    };
  }
}
