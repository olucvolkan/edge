import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './graphql/entities/edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';
import * as amqp from 'amqplib';

@Injectable()
export class EdgeService {
    constructor(
        @InjectRepository(Edge)
        private edgeRepository: Repository<Edge>,
    ) {}

    findAll(): Promise<Edge[]> {
        return this.edgeRepository.find();
    }

    findOne(id: string): Promise<Edge> {
        return this.edgeRepository.findOne({ where: { id } });
    }

    async create(createEdgeInput: CreateEdgeInput): Promise<Edge> {
        const edge = this.edgeRepository.create(createEdgeInput);
        edge.capacity = Math.floor(Math.random() * (1000000 - 10000) + 10000);
        const savedEdge = await this.edgeRepository.save(edge);

        // Send message to RabbitMQ
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        await channel.assertQueue('edge_created', { durable: true });
        channel.sendToQueue('edge_created', Buffer.from(JSON.stringify(savedEdge)));

        return savedEdge;
    }
}