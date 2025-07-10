import { SupabaseClient } from '@supabase/supabase-js'
import { MenuRepository } from '../../domain/repositories/MenuRepository'
import { FileRepository } from '../../domain/repositories/FileRepository'
import { MenuImageRepository } from '../../domain/repositories/MenuImageRepository'
import { SbMenuRepository } from '../repositories/SbMenuRepository'
import { SbFileRepository } from '../repositories/SbFileRepository'
import { SbMenuImageRepository } from '../repositories/SbMenuImageRepository'

export class RepositoryFactory {
  constructor(private supabase: SupabaseClient) {}

  createMenuRepository(): MenuRepository {
    return new SbMenuRepository(this.supabase)
  }

  createFileRepository(): FileRepository {
    return new SbFileRepository(this.supabase, 'image')
  }

  createMenuImageRepository(): MenuImageRepository {
    return new SbMenuImageRepository(this.supabase)
  }
}
