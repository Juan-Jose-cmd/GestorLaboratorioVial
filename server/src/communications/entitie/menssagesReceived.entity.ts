import { Users } from "src/users/entitie/users.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({
    name: 'MENSSAGE_RECEIVED'
})
export class MessageReceived {
    @ManyToOne(() => Users, (user) => user.mesageReceived)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}