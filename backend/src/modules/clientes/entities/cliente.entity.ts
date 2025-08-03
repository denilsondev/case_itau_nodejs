import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('clientes')
export class Cliente {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    saldo?: number;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}

