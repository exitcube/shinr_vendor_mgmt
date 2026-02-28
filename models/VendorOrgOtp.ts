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
import { VendorOrganization } from './VendorOrganization';

 

@Entity('vendorOrgOtp')
export class VendorOrgOtp {
    @PrimaryGeneratedColumn()
    id: number; // internal auto-increment id (good for sorting)

    @Column()
    @Generated('uuid')
    uuid: string; // external unique identifier (safe for exposure)

    @Column()
    @Index()
    vendorOrgId: number;

    @ManyToOne(() => VendorOrganization,{ onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorOrgId' })
    user: VendorOrganization;

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
