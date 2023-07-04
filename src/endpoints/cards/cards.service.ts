import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Card } from "./entities/card.entity";
import { CreateCardInput } from "./dto/create-card.input";
import { UpdateCardInput } from "./dto/update-card.input";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
    private usersService: UsersService,
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
}
