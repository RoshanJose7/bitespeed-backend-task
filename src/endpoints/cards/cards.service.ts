import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Card } from "./entities/card.entity";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { CreateCardInput } from "./dto/create-card.input";
import { UpdateCardInput } from "./dto/update-card.input";
import { CardTemplate } from "../card_templates/entities/card_template.entity";
import { CardTemplatesService } from "../card_templates/card_templates.service";

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
    private usersService: UsersService,
    private cardTemplatesService: CardTemplatesService,
  ) {}

  create(createCardInput: CreateCardInput): Promise<Card> {
    const card = this.cardsRepository.create(createCardInput);
    return this.cardsRepository.save(card);
  }

  findAll(): Promise<Card[]> {
    return this.cardsRepository.find();
  }

  findOne(id: string): Promise<Card> {
    return this.cardsRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, updateCardInput: UpdateCardInput): Promise<Card> {
    await this.cardsRepository.update({ id }, updateCardInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Card> {
    const card = await this.findOne(id);
    await this.cardsRepository.delete({ id });
    return card;
  }

  // Misc
  getCardOwner(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  getCardTemplate(cardTemplateId: string): Promise<CardTemplate> {
    return this.cardTemplatesService.findOne(cardTemplateId);
  }
}
