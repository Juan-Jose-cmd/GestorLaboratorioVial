import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Users } from 'src/users/entitie/users.entity';

@Entity({ name: 'LABORATORIES' })
export class Laboratory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Users, (user) => user.laboratory)
  users: Users[];
}