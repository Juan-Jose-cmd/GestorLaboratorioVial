import { Users } from "src/users/entitie/users.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({
    name: 'MENSSAGE_SENT'
})
export class MessageSent {
    @ManyToOne(() => Users, (user) => user.messagesSent)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}