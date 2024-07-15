import * as amqp from 'amqplib';
import {Injectable, OnModuleInit} from "@nestjs/common";
import {Edge} from "../edge/graphql/entities/edge.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EdgeService} from "../edge/edge.service";

@Injectable()
export class RabbitMQService implements OnModuleInit {
    constructor(
        @InjectRepository(Edge)
        private edgeRepository: Repository<Edge>,
        private readonly edgeService: EdgeService,
    ) {}

    async onModuleInit() {
        const client = await this.createRabbitMQClient();
        const channel = await client.createChannel();
        await channel.assertQueue('edge_created', { durable: true });

        channel.consume('edge_created', async (msg) => {
            if (msg !== null) {
                const edge = JSON.parse(msg.content.toString());
                console.log(
                    `New channel between ${edge.node1_alias} and ${edge.node2_alias} with a capacity of ${edge.capacity} has been created.`,
                );
                edge.node1_alias = `${edge.node1_alias}-updated`;
                edge.node2_alias = `${edge.node2_alias}-updated`;
                await this.edgeRepository.save(edge);
                channel.ack(msg);
            }
        });
    }

    private async createRabbitMQClient() {
        const connection = await amqp.connect('amqp://localhost:5672');
        return connection;
    }
}