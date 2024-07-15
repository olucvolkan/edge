import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from '../edge/graphql/entities/edge.entity';
import { EdgeService } from '../edge/edge.service';

@Module({
    imports: [TypeOrmModule.forFeature([Edge])],
    providers: [RabbitMQService, EdgeService],
})
export class RabbitMQModule {}