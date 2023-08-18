import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { LinkPrecedence } from "../../utils/enums";

/**
 * Contact entity represents individual contacts in the system.
 */
@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "varchar",
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  email?: string;

  @Column({
    type: "integer",
    nullable: true,
  })
  linkedId?: number;

  @Column({
    type: "enum",
    enum: LinkPrecedence,
    default: LinkPrecedence.PRIMARY,
  })
  linkedPrecedence: LinkPrecedence;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
