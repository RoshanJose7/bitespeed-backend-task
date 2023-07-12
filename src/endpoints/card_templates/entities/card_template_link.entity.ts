import { ObjectType, Field } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CardTemplate } from "./card_template.entity";
import { CARDTEMPLATELINKTYPE } from "../constants/enums.constants";

@Entity()
@ObjectType()
export class CardTemplateLink {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({
    type: "enum",
    enum: CARDTEMPLATELINKTYPE,
  })
  @Field(() => CARDTEMPLATELINKTYPE, {
    description: "Type of Card Template Link",
  })
  type: CARDTEMPLATELINKTYPE;

  @Column({
    type: "varchar",
  })
  @Field({ description: "Icon for Card Template Link" })
  icon: string;

  @Column({
    type: "varchar",
    array: true,
  })
  @Field(() => [String], { description: "Links for Card Template Link" })
  links: string[];

  @ManyToOne(() => CardTemplate, (cardTemplate) => cardTemplate.links)
  @Field(() => CardTemplate, {
    description: "Card Template of for Links",
    nullable: true,
  })
  cardTemplate?: CardTemplate;
}
