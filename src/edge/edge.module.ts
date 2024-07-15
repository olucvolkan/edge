import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdgeService } from './edge.service';
import { EdgeResolver } from './graphql/edge.resolver';
import { Edge } from './graphql/entities/edge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Edge])],
  providers: [EdgeService, EdgeResolver],
})
export class EdgeModule {}