import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Edge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'integer' })
    capacity: number;

    @Column({ type: 'varchar' })
    node1_alias: string;

    @Column({ type: 'varchar' })
    node2_alias: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    get edge_peers(): string {
        return `${this.node1_alias}-${this.node2_alias}`;
    }
}