import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findUsersById(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    return user;
  }
  async findUser(userName: string) {
    const user = await this.userRepository.findOneBy({ username: userName });
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    return user;
  }
  getUsers() {
    return this.userRepository.find();
  }
}
