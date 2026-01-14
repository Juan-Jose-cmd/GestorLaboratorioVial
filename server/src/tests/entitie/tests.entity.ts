import { Users } from "src/users/entitie/users.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({
    name: 'TEST'
})
export class Tests {

    @ManyToOne(() => Users, (user) => user.test)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}