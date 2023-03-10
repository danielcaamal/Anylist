import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListModule } from './list/list.module';
import { ListItemModule } from './list-item/list-item.module';


@Module({
  imports: [

    ConfigModule.forRoot(),

    // Protected Configuration (Needs API Implementation)
    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule],
    //   inject: [JwtService],
    //   useFactory: async(jwtService: JwtService) => {
    //     return {
    //       playground: false,
    //       autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
    //       plugins: [
    //         ApolloServerPluginLandingPageLocalDefault
    //       ],
    //       context({ req }) {
    //         const token = req.headers.authorization?.replace('Bearer ', '');
    //         if (!token) throw new Error('No token');

    //         const payload = jwtService.decode(token);
    //         if (!payload) throw new Error('Invalid token');
    //       }
    //     }
    //   }
    // }),

    // Basic Configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
      plugins: [
        ApolloServerPluginLandingPageLocalDefault
      ]
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),

    ItemsModule,

    UsersModule,

    AuthModule,

    SeedModule,

    CommonModule,

    ListModule,

    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
