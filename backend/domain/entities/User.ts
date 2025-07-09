import UserRole from './UserRole';
import Alarm from './Alarm';

export default class User {
    constructor(
        public id: string,
        public username: string,
        public password: string,
        public email: string,
        public createdAt: Date,
        public deletedAt: Date | null,
        public image: string | null,
        public updatedAt: Date | null,
        //관계
        public userRole?: UserRole,
        public userAlarms?: Alarm[], // 1:N
    ) {}
}