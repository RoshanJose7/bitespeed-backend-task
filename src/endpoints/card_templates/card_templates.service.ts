import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CardTemplate } from "./entities/card_template.entity";
import { CardTemplateLink } from "./entities/card_template_link.entity";
import { CreateCardTemplateInput } from "./dto/create-card_template.input";
import { UpdateCardTemplateInput } from "./dto/update-card_template.input";
import { CreateCardTemplateLinkInput } from "./dto/create-card_template_link.input";
import { UpdateCardTemplateLinkInput } from "./dto/update-card_template_link.input";

@Injectable()
export class CardTemplatesService {
  constructor(
    @InjectRepository(CardTemplate)
    private cardTemplatesRepository: Repository<CardTemplate>,
    @InjectRepository(CardTemplateLink)
    private cardTemplateLinksRepository: Repository<CardTemplateLink>,
  ) {}

  create(
    createCardTemplateInput: CreateCardTemplateInput,
  ): Promise<CardTemplate> {
    const cardTemplate = this.cardTemplatesRepository.create(
      createCardTemplateInput,
    );
    return this.cardTemplatesRepository.save(cardTemplate);
  }

  createLink(
    createCardTemplateLinkInput: CreateCardTemplateLinkInput,
  ): Promise<CardTemplateLink> {
    const cardTemplateLink = this.cardTemplateLinksRepository.create(
      createCardTemplateLinkInput,
    );

    return this.cardTemplateLinksRepository.save(cardTemplateLink);
  }

  findAll(): Promise<CardTemplate[]> {
    return this.cardTemplatesRepository.find();
  }

  findAllLinks(): Promise<CardTemplateLink[]> {
    return this.cardTemplateLinksRepository.find();
  }

  findOne(id: string): Promise<CardTemplate> {
    return this.cardTemplatesRepository.findOneOrFail({ where: { id } });
  }

  findOneLink(id: string): Promise<CardTemplateLink> {
    return this.cardTemplateLinksRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    updateCardTemplateInput: UpdateCardTemplateInput,
  ): Promise<CardTemplate> {
    await this.cardTemplatesRepository.update({ id }, updateCardTemplateInput);
    return this.findOne(id);
  }

  async updateLink(
    id: string,
    updateCardTemplateLinkInput: UpdateCardTemplateLinkInput,
  ): Promise<CardTemplateLink> {
    await this.cardTemplateLinksRepository.update(
      { id },
      updateCardTemplateLinkInput,
    );

    return this.findOneLink(id);
  }

  async remove(id: string): Promise<CardTemplate> {
    const cardTemplate = await this.findOne(id);
    await this.cardTemplatesRepository.delete({ id });
    return cardTemplate;
  }

  async removeLink(id: string): Promise<CardTemplateLink> {
    const cardTemplateLink = await this.findOneLink(id);
    await this.cardTemplateLinksRepository.delete({ id });
    return cardTemplateLink;
  }
}
