import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Company } from './company.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => Company, {
    nullable: false,
    fieldName: 'company_ref',
    referenceColumnName: 'company_ref',
  })
  companyRef!: Company;

  @Property({ length: 255 })
  name!: string;

  @Property({ unique: true, length: 255, hidden: true })
  login!: string;

  @Property({ length: 255, hidden: true })
  password!: string;

  @Property()
  active: boolean = true;

  @Property({ type: 'text', default: UserRole.USER })
  role: UserRole = UserRole.USER;

  @Property({ onCreate: () => new Date(), hidden: true })
  createdAt?: Date;

  @Property({ onUpdate: () => new Date(), hidden: true, nullable: true })
  updatedAt?: Date;
}
