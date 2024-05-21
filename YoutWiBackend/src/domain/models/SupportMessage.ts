import {User} from "./User";

class SupportMessage {
    id: number;
    userId: number;
    message: string;
    createdAt: Date;
    isFromSupport: boolean;
    user: User;
}

export { SupportMessage };