import { User } from "./User";

export enum AlarmType {
//FIXME : Enum타입 정의 어디에서 해야 할지?
    TYPE1 = "KEYWORD",
    TYPE2 = "REPLY",
    TYPE3 = "ADMIN"
}

export class Alarm {
    constructor(
        public alarmId: number,
        public userId: string, // uuid
        public message: string,
        public isRead: boolean = false,
        public createdAt: Date = new Date(),
        public alarmType: AlarmType,
        // 관계
        public user?: User // N:1 관계
    ) {}
}