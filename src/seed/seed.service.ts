import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed.data';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {

    private isProd: boolean = true;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly userService: UsersService,
    ) {
        this.isProd = this.configService.get<string>('STATE').toUpperCase() === 'PROD';
    }

    async executeSeed(): Promise<boolean> {
        if (this.isProd) throw new Error('Cannot execute seed in production');
        // Clean database
        await this.deleteDatabase();
        // Create users
        const users = await this.loadUsers();
        // Create items
        const items = await this.loadItems();
        return true;
    }

    async deleteDatabase(): Promise<boolean> {
        if (this.isProd) throw new Error('Cannot delete database in production');
        await this.itemsRepository.clear();
        await this.usersRepository.clear();
        return true;
    }

    async loadUsers(): Promise<User[]> {
        if (this.isProd) throw new Error('Cannot load users in production');
        const users: User[] = [];
        for (const user of SEED_USERS) {
            users.push(await this.userService.create(user)); // TODO: Fix with a bulk insert
        }
        return users;
    }

    async loadItems(): Promise<Item[]> {
        if (this.isProd) throw new Error('Cannot load items in production');
        const items: Item[] = [];
        for (const item of SEED_ITEMS) {
            items.push(await this.itemsRepository.save(item)); // TODO: Fix with a bulk insert
        }
        return items;
    }
}
