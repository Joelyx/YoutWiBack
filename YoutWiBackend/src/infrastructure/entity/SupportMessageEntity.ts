import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity({ name: 'support_messages' })
export class SupportMessageEntity {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'bigint' })
    userId!: number;

    @Column('text')
    message!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: 'tinyint', default: 0 })
    isFromSupport!: boolean;

    @ManyToOne(() => UserEntity, user => user.supportMessages)
    @JoinColumn({ name: 'userId' })
    user!: UserEntity;
}