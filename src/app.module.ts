import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { EdgeModule } from './edge/edge.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import {Edge} from "./edge/entities/edge.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'edgesdb',
      entities:[__dirname + '/../entities/*.{ts,js}'],
      autoLoadEntities: true,
      migrationsRun: true,
      synchronize: false,
      retryAttempts: 5,
      retryDelay: 3000,
    }),
    TypeOrmModule.forFeature([Edge]),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    EdgeModule,
    RabbitMQModule,
  ],
})
export class AppModule {}