import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
    Generated
} from 'typeorm';
import { Vendor } from './Vendor';

 

@Entity('vendorOtp')
export class VendorOtp {
    @PrimaryGeneratedColumn()
    id: number; // internal auto-increment id (good for sorting)

    @Column()
    @Generated('uuid')
    uuid: string; // external unique identifier (safe for exposure)

    @Column()
    @Index()
    vendorId: number;

    @ManyToOne(() => Vendor,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    user: Vendor;

    @Column()
    otp: string;

    @Column()
    otpToken: string;

    @Column({ type: 'timestamp' })
    lastRequestedTime: Date;

    @Column({ type: 'smallint', default: 0 })
    requestCount: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
