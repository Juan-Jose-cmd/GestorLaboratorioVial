import { Users } from "src/users/entitie/users.entity";
import { Entity, JoinColumn, OneToMany } from "typeorm";

@Entity({
    name: 'LABORATORY'
})
export class Laboratory {

    @OneToMany(() => Users, (user) => user.laboratory)
    @JoinColumn({ name: 'user_id' })
    users: Users[];
}