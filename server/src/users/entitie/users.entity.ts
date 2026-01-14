import { CreateDateColumn, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Laboratory } from 'src/laboratory/entitie/laboratory.entity';
import { RequestTest } from "src/requests/entitie/requestTest.entity";
import { Tests } from 'src/tests/entitie/tests.entity';
import { MessageSent } from "src/communications/entitie/menssagesSent.entity";
import { MessageReceived } from "src/communications/entitie/menssagesReceived.entity";

@Entity({
  name: 'USERS',
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'int',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 60,
  })
  site: string;

  @Column({
    enum: ['laboratorist', 'administrator', 'supervisor', 'engineer', 'customer'],
    default: 'laboratorist',
  })
  role: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column()
  avatarUrl: string;

  @Column()
  lastAccess: string;

  @Column()
  failedAttempts: string;

  @Column()
  isExternal: string;

  @Column()
  preferencesNotification: string;

  @OneToMany(() => RequestTest, (test) => test.user)
  @JoinColumn({ name: 'requestTest_id' })
  requestTest: RequestTest[];

  @OneToMany(() => Tests, (tests) => tests.user)
  @JoinColumn({ name: 'test_id' })
  test: Tests[];

  @OneToMany(() => MessageSent, (messageSent) => messageSent.user)
  @JoinColumn({ name: 'test_id' })
  messagesSent: MessageSent[];

  @OneToMany(() => MessageReceived, (mesageReceived) => mesageReceived.user)
  @JoinColumn({ name: 'test_id' })
  mesageReceived: MessageReceived[];

  @ManyToOne(() => Laboratory, (laboratory) => laboratory.users)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory: Laboratory;

  @ManyToOne(() => Users, (bossDirect) => bossDirect.subordinates)
  @JoinColumn({ name: 'subordinates_id' })
  bossDirect: Users[];

  @OneToMany(() => Users, (subordinates) => subordinates.bossDirect)
  @JoinColumn({ name: 'bossdirect_id' })
  subordinates: Users;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

}