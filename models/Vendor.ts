
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";

import { VendorDocument } from "./VendorDocument";
import { Service } from "./Service";
import { Product } from "./Product";
import { VendorDevice } from "./VendorDevice";
import { Generated, Index, OneToOne } from "typeorm";

export enum VerificationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

@Entity()
export class Vendor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: "varchar", length: 255 })
    businessName: string;

    @Column({ type: "varchar", length: 255 })
    ownerName: string;

    @Column({ unique: true, type: "varchar", length: 20 })
    phone: string;

    @Column({ nullable: true, type: "varchar", length: 255 })
    email: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ nullable: true, type: "varchar", length: 100 })
    gst: string;

    @Column("jsonb", { nullable: true })
    location: {
        address: string;
        lat: number;
        lng: number;
        city?: string;
        pincode?: string;
    };

    @Column("simple-array", { nullable: true })
    serviceType: string[];

    @Column({
        type: "enum",
        enum: VerificationStatus,
        default: VerificationStatus.PENDING,
    })
    verificationStatus: VerificationStatus;

    @Column({ default: false })
    profileCompleted: boolean;

    @Column("jsonb", { nullable: true })
    shopDetails: {
        workingHours?: { start: string; end: string };
        weeklyOff?: string[];
        contactDetails?: string;
        numberOfBays?: number;
        serviceRadius?: number;
    };

    @Column("jsonb", { nullable: true })
    availabilitySettings: {
        activeDays?: string[];
        timeSlots?: { start: string; end: string; maxBookings: number }[];
        breakTime?: number;
    };


    @Column({ default: true })
    isActive: boolean;

    @Column()
    @Generated("uuid")
    @Index()
    uuid: string;

    @OneToOne(() => VendorDevice, (device) => device.vendor)
    device: VendorDevice;

    @OneToMany(() => VendorDocument, (doc) => doc.vendor)
    documents: VendorDocument[];

    @OneToMany(() => Service, (service) => service.vendor)
    services: Service[];

    @OneToMany(() => Product, (product) => product.vendor)
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
