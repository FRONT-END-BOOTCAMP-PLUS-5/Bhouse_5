import { Alarm, AlarmType } from '../entities/Alarms'
import { AlarmRelationOptions } from './options/AlarmRelationOptions'

export default interface AlarmRepository {
  findAll(relations?: AlarmRelationOptions): Promise<Alarm[]>
  findById(alarmId: number, relations?: AlarmRelationOptions): Promise<Alarm | null>
  findByUserId(userId: string, relations?: AlarmRelationOptions): Promise<Alarm[]>
  save(alarm: Alarm): Promise<Alarm>
  update(alarm: Alarm): Promise<Alarm>
  delete(alarmId: number): Promise<void>
  markAsRead(alarmId: number): Promise<void>
}
