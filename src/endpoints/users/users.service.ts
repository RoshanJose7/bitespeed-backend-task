import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    await this.usersRepository.update({ id }, updateUserInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.usersRepository.delete({ id });
    return user;
  }
}
