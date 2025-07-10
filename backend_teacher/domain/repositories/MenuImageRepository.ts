import { MenuImage } from '../entities/MenuImage'
import { MenuImageRelationsOptions } from './options/MenuImageRelationsOptions'

export interface MenuImageRepository {
  findAll(relations?: MenuImageRelationsOptions): Promise<MenuImage[]>
  findById(id: number, relations?: MenuImageRelationsOptions): Promise<MenuImage | null>
  save(menuImage: MenuImage): Promise<MenuImage>
  update(menuImage: MenuImage): Promise<MenuImage>
  delete(id: number): Promise<void>
}
