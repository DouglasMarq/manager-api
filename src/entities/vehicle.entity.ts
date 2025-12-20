import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Company } from './company.entity';

@Entity()
export class Vehicle {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => Company, {
    nullable: false,
    fieldName: 'company_ref',
    referenceColumnName: 'company_ref',
  })
  companyRef!: Company;

  @Property({ nullable: true, length: 255 })
  license?: string;

  @Property({ unique: true, length: 255 })
  vin!: string;

  @Property({ nullable: true })
  lat?: number;

  @Property({ nullable: true })
  long?: number;

  @Property({ default: 0 })
  fuelLevel!: number;

  @Property()
  active?: boolean = true;

  @Property({ onCreate: () => new Date(), hidden: true })
  createdAt?: Date;

  @Property({ onUpdate: () => new Date(), hidden: true, nullable: true })
  updatedAt?: Date;
}
