import { Test, TestingModule } from '@nestjs/testing';
import { EdgeService } from './edge.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Edge } from './graphql/entities/edge.entity';
import { Repository } from 'typeorm';
import { CreateEdgeInput } from './dto/create-edge.input';
import * as amqp from 'amqplib';

jest.mock('amqplib');

describe('EdgeService', () => {
  let service: EdgeService;
  let repository: Repository<Edge>;
  let amqpConnection;
  let amqpChannel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeService,
        {
          provide: getRepositoryToken(Edge),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EdgeService>(EdgeService);
    repository = module.get<Repository<Edge>>(getRepositoryToken(Edge));

    amqpConnection = {
      createChannel: jest.fn(),
      close: jest.fn(),
    };

    amqpChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
      close: jest.fn(),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(amqpConnection);
    amqpConnection.createChannel.mockResolvedValue(amqpChannel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of edges', async () => {
      const result: Edge[] = [
        new Edge(),
        new Edge(),
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single edge', async () => {
      const id = '1';
      const result = new Edge();
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return an edge', async () => {
      const createEdgeInput: CreateEdgeInput = {
        node1_alias: 'Node1',
        node2_alias: 'Node2',
      };

      const savedEdge: Edge = {
        id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        capacity: 10000,
        node1_alias: 'Node1',
        node2_alias: 'Node2',
        edge_peers: 'Node1-Node2',
      };

      jest.spyOn(repository, 'create').mockReturnValue(savedEdge);
      jest.spyOn(repository, 'save').mockResolvedValue(savedEdge);
      amqpChannel.assertQueue.mockResolvedValue(null);
      amqpChannel.sendToQueue.mockResolvedValue(null);

      const result = await service.create(createEdgeInput);

      expect(result).toBe(savedEdge);
      expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost:5672');
      expect(amqpConnection.createChannel).toHaveBeenCalled();
      expect(amqpChannel.assertQueue).toHaveBeenCalledWith('edge_created', { durable: true });
      expect(amqpChannel.sendToQueue).toHaveBeenCalledWith('edge_created', Buffer.from(JSON.stringify(savedEdge)));
    });
  });
});