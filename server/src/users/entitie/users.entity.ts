import { CreateDateColumn, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Index } from "typeorm";
import { Laboratory } from 'src/laboratory/entitie/laboratory.entity';
import { RequestTest } from "src/requests/entitie/requestTest.entity";
import { Tests } from 'src/tests/entitie/tests.entity';
import { MessageSent } from "src/communications/entitie/menssagesSent.entity";
import { MessageReceived } from "src/communications/entitie/menssagesReceived.entity";
import { Role } from '../roles.enum'; 

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
  @Index()
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 60,
  })
  @Index() 
  site: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Laboratorist,
  })
  @Index() 
  role: Role;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Index() 
  isActive: boolean;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  lastAccess: Date;

  @Column({ type: 'int', default: 0 })
  failedAttempts: number;

  @Column({ type: 'boolean', default: false })
  isExternal: boolean;

  @Column({ 
    type: 'json',
    nullable: true 
  })
  preferencesNotification: Record<string, any>;

  @OneToMany(() => RequestTest, (request) => request.user)
  requestTests: RequestTest[];

  @OneToMany(() => Tests, (test) => test.user)
  tests: Tests[];

  @OneToMany(() => MessageSent, (messageSent) => messageSent.user)
  messagesSent: MessageSent[];

  @OneToMany(() => MessageReceived, (messageReceived) => messageReceived.user)
  messagesReceived: MessageReceived[];

  @ManyToOne(() => Laboratory, (laboratory) => laboratory.users)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory: Laboratory;

  @ManyToOne(() => Users, (boss) => boss.subordinates, { 
    nullable: true,
    onDelete: 'SET NULL' 
  })
  @JoinColumn({ name: 'boss_id' })
  boss: Users;

  @OneToMany(() => Users, (subordinate) => subordinate.boss, {
    cascade: false, 
    eager: false    
  })
  subordinates: Users[];

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