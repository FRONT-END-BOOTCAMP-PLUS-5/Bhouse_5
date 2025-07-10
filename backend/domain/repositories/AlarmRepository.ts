import { Alarm, AlarmType } from '../entities/Alarm'
import AlarmRelationsOptions from './options/AlarmRelationsOptions'
//FIXME : relations 옵션을 언제 정의해야 하는지 잘 모르겠습니다?

export default interface AlarmRepository {
  findAll(relations?: AlarmRelationsOptions): Promise<Alarm[]>
  findById(alarmId: number, relations?: AlarmRelationsOptions): Promise<Alarm | null>
  findByUserId(userId: string, relations?: AlarmRelationsOptions): Promise<Alarm[]>
  save(alarm: Alarm): Promise<Alarm>
  update(alarm: Alarm): Promise<Alarm>
  delete(alarmId: number): Promise<void>
  markAsRead(alarmId: number): Promise<void>
}
