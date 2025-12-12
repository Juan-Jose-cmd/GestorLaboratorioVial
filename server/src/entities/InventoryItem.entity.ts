import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

export enum InventoryCategory {
  EQUIPMENT = 'equipment',
  REAGENT = 'reagent',
  MATERIAL = 'material',
  CONSUMABLE = 'consumable',
  TOOL = 'tool'
}

export enum UnitType {
  UNIT = 'unit',
  KILOGRAM = 'kg',
  LITER = 'L',
  METER = 'm',
  BOX = 'box'
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: InventoryCategory
  })
  category: InventoryCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentQuantity: number;

  @Column({
    type: 'enum',
    enum: UnitType,
    default: UnitType.UNIT
  })
  unit: UnitType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumQuantity: number; 

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ length: 100, nullable: true })
  supplier: string;

  @Column({ length: 50, nullable: true })
  serialNumber: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  @ManyToOne(() => User, { nullable: true })
  lastUpdatedBy: User;
}