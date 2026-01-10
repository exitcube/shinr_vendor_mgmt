
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index, Generated } from "typeorm";
import { Vendor } from "./Vendor";

@Entity()
export class VendorDevice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated("uuid")
    @Index()
    uuid: string;

    @OneToOne(() => Vendor, (vendor) => vendor.device, { onDelete: "CASCADE" })
    @JoinColumn()
    vendor: Vendor;

    @Column()
    vendorId: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    deviceId: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    fcmToken: string;

    @Column({ type: "timestamp", nullable: true })
    lastLogin: Date;

    @Column({ type: "timestamp", nullable: true })
    lastActive: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    userAgent: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    ipAddress: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
