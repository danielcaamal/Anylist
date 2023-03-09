import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { SingUpInput } from 'src/auth/dto/inputs/sign-up.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isInstance } from 'class-validator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/inputs/udpate-user.input';

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

  async findAll(validRoles: ValidRoles[]) : Promise<User[]> {
    try {
      if (validRoles.length === 0) return await this.usersRepository.find({
        relations: ['lastUpdateBy']
      });

      return await this.usersRepository.createQueryBuilder()
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        .setParameters({ roles: validRoles })
        .getMany();
      
    }
    catch (error) {
      this.handleDBErrors(error);
    }
    
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

  async blockUserById(id: string, blockedBy: User): Promise<User> {
    try {
      var user = await this.findOneById(id);
      user.isActive = false;
      user.lastUpdateBy = blockedBy;
      return await this.usersRepository.save(user);
    }
    catch (error) {
      this.handleDBErrors(error);
    }
  }

  async update(
    id: string, 
    updateUserInput: UpdateUserInput, 
    updateBy:User
    ): Promise<User> {
    try {
      var user = await this.usersRepository.preload({});
      user.lastUpdateBy = user;
      return await this.usersRepository.save(user);
    }
    catch (error) {
      this.handleDBErrors(error);
    }
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
