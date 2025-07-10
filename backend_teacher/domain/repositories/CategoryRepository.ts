import { Category } from '../entities/Category'
import { CategoryRelationsOptions } from './options/CategoryRelationsOptions'

export interface CategoryRepository {
  findAll(relations?: CategoryRelationsOptions): Promise<Category[]>
  findById(id: number, relations?: CategoryRelationsOptions): Promise<Category | null>
  save(category: Category): Promise<Category>
  update(category: Category): Promise<Category>
  delete(id: number): Promise<void>
}
