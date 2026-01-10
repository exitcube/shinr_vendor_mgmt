
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Vendor } from "./Vendor";

export enum RefreshTokenStatus {
    ACTIVE = 'ACTIVE',
    USED = 'USED',
    REVOKED = 'REVOKED',
    INACTIVE = 'INACTIVE'
}

@Entity()
export class VendorToken {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
    vendor: Vendor;

    @Column()
    vendorId: number;

    @Column({
        type: "enum",
        enum: RefreshTokenStatus,
        default: RefreshTokenStatus.ACTIVE,
    })
    refreshTokenStatus: RefreshTokenStatus;

    @Column({ default: true })
    isActive: boolean;

    @Column("text")
    refreshToken: string;

    @Column("text")
    accessToken: string;

    @Column("timestamp")
    refreshTokenExpiry: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
