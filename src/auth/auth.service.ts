import { Injectable, NotImplementedException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginInput, SingUpInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async signUp(signUpInput: SingUpInput): Promise<AuthResponse> {
        const user = await this.usersService.create({
            ...signUpInput, 
            password: await bcrypt.hash(signUpInput.password, 10)
        });
        const token = await this.getJWTToken(user);
        return { token, user };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail(email);
        if (!(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid credentials');
        }
        const token = await this.getJWTToken(user);
        return { token, user };
    }

    async validateUser(id: string): Promise<User> {
        const user = await this.usersService.findOneById(id);
        if (!user.isActive) {
            throw new UnauthorizedException();
        }
        delete user.password;
        return user;
    }

    async revalidateToken(user: User): Promise<AuthResponse> {
        const token = await this.getJWTToken(user);
        return { token, user };
    }

    private async getJWTToken(user: User): Promise<string> {
        return await this.jwtService.signAsync({ id: user.id });
    }


}
