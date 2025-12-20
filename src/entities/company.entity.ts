import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Company {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ length: 255 })
  name!: string;

  @Property()
  address!: string;

  @Property({ length: 20 })
  phone!: string;

  @Property()
  active: boolean = true;

  @Property({ unique: true })
  companyRef!: number;

  @Property({ hidden: true })
  login!: string;

  @Property({ hidden: true })
  password!: string;

  @Property()
  callbackUrl!: string;

  @Property({ onCreate: () => new Date(), hidden: true })
  createdAt?: Date;

  @Property({ onUpdate: () => new Date(), hidden: true, nullable: true })
  updatedAt?: Date;
}
