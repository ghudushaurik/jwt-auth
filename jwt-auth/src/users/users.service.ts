import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { hash } from '@node-rs/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const password = await hash(createUserDto.password, 13);
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      password,
    });
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
