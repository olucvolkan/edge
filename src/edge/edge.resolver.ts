import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EdgeService } from './edge.service';
import { Edge } from './entities/edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';

@Resolver(() => Edge)
export class EdgeResolver {
    constructor(private readonly edgeService: EdgeService) {}

    @Query(() => [Edge])
    getEdges() {
        return this.edgeService.findAll();
    }

    @Query(() => Edge)
    getEdge(@Args('id') id: string) {
        return this.edgeService.findOne(id);
    }

    @Mutation(() => Edge)
    createEdge(
        @Args('node1_alias') node1_alias: string,
        @Args('node2_alias') node2_alias: string,
    ) {
        const createEdgeInput = new CreateEdgeInput();
        createEdgeInput.node1_alias = node1_alias;
        createEdgeInput.node2_alias = node2_alias;
        return this.edgeService.create(createEdgeInput);
    }
}