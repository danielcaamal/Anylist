import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SingUpInput } from 'src/auth/dto/inputs/sign-up.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isInstance } from 'class-validator';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }

  async create(singUpInput: SingUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create(singUpInput);
      return await this.usersRepository.save(newUser);
    }
    catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() : Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    }
    catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    }
    catch (error) {
      this.handleDBErrors(error);
    }
  }

  block(id: string): Promise<User> {
    throw NotImplementedException;
  }

  private handleDBErrors(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    } else if (error instanceof NotFoundException) {

    }

    this.logger.error(error);
    throw new InternalServerErrorException('Something went wrong');
  }
}
