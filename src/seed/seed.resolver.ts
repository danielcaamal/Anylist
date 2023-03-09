import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(
    private readonly seedService: SeedService
    ) {
  }

  @Mutation(() => Boolean, { name: 'executeSeed', description: 'Execute seed' }) 
  async executeSeed(): Promise<boolean> {
    return await this.seedService.executeSeed();
  }
}
