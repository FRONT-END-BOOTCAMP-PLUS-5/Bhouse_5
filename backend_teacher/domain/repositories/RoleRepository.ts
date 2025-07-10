import { Role } from '../entities/Role'
import { RoleRelationsOptions } from './options/RoleRelationsOptions'

export interface RoleRepository {
  findAll(relations?: RoleRelationsOptions): Promise<Role[]>
  findById(id: number, relations?: RoleRelationsOptions): Promise<Role | null>
  save(role: Role): Promise<Role>
  update(role: Role): Promise<Role>
  delete(id: number): Promise<void>
}
