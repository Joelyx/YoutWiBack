import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import {SupportMessageEntity} from "./SupportMessageEntity";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'text', nullable: true})
    googleId?: string;

    @Column({ length: 255, unique: true })
    username!: string;

    @Column({ length: 255 })
    password!: string;

    @Column({ length: 255 })
    uid!: string;

    @Column({ length: 255, unique: true })
    email!: string;

    @Column({ default: false })
    active!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;

    @Column({ length: 10, default: 'ROLE_USER' })
    roles!: string;

    @OneToMany(() => SupportMessageEntity, supportMessage => supportMessage.user)
    supportMessages!: SupportMessageEntity[];
}