import { Users } from "src/users/entitie/users.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({
    name: 'REQUEST_TEST'
})

export class RequestTest {
    @ManyToOne(() => Users, (user) => user.requestTest)
    @JoinColumn({ name: 'user_id' })
    user: Users;
}