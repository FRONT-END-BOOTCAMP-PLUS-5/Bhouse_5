import { User } from "./User";
import { Role } from "./Role";

export class UserRole {
    constructor(
        public userId: string, // uuid
        public roleId: number, // bigint
        public user?: User, // N:1
        public role?: Role // N:1
    ) {}
}