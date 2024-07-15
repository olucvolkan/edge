# Edge GraphQL API with NestJS, PostgreSQL, and RabbitMQ

This project is a backend developer exercise for Amboss Technologies. It demonstrates building a GraphQL API using NestJS that performs CRUD operations on a PostgreSQL database and interacts with RabbitMQ for event handling.

## Features

- **GraphQL API**:
    - **Query**: `getEdges`
        - Retrieves an array of all edges stored in the database.
    - **Query**: `getEdge`
        - Retrieves a single edge based on the provided `id`.
    - **Mutation**: `createEdge`
        - Creates a new edge with the specified `node1_alias` and `node2_alias`. The created edge is then sent to a RabbitMQ queue.

- **RabbitMQ Handler**:
    - Listens to events from the RabbitMQ queue.
    - Logs a message indicating a new channel has been created.
    - Updates the aliases of the edge in the database.

## Getting Started

These instructions will help you set up and run the project on your local machine.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (version 14 or later)

### Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/olucvolkan/edge.git
    cd edge
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Start Docker containers**:

    ```sh
    docker-compose up -d
    ```

   This will start the PostgreSQL and RabbitMQ containers.

4. **Run the NestJS application**:

    ```sh
    npm run start:dev
    ```

### Configuration

Ensure the following environment variables are set in the `docker-compose.yml` and `app.module.ts`:

- **PostgreSQL**:
    - `POSTGRES_USER: postgres`
    - `POSTGRES_PASSWORD: postgres`
    - `POSTGRES_DB: edgesdb`

- **RabbitMQ**:
    - `urls: ['amqp://rabbitmq:5672']`

### GraphQL API Endpoints

- **Query: getEdges**

    ```graphql
    query {
      getEdges {
        id
        created_at
        updated_at
        capacity
        node1_alias
        node2_alias
        edge_peers
      }
    }
    ```

- **Query: getEdge**

    ```graphql
    query {
      getEdge(id: "<EDGE_ID>") {
        id
        created_at
        updated_at
        capacity
        node1_alias
        node2_alias
        edge_peers
      }
    }
    ```

- **Mutation: createEdge**

    ```graphql
    mutation {
      createEdge(node1_alias: "<NODE1_ALIAS>", node2_alias: "<NODE2_ALIAS>") {
        id
        created_at
        updated_at
        capacity
        node1_alias
        node2_alias
        edge_peers
      }
    }
    ```

### RabbitMQ Handler

The RabbitMQ handler processes events sent to the queue and logs a message:

```sh
New channel between [node1_alias] and [node2_alias] with a capacity of [capacity] has been created.