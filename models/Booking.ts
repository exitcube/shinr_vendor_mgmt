
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Vendor } from "./Vendor";
import { Service } from "./Service";

export enum BookingStatus {
    UPCOMING = "UPCOMING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
    PAID = "PAID",
    REFUND_REQUESTED = "REFUND_REQUESTED",
    PENDING = "PENDING",
}

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
    vendor: Vendor;

    @Column()
    vendorId: number;

    @Column({ nullable: true })
    customerId: string; // valid user id if exists

    @Column("jsonb")
    customerDetails: {
        name: string;
        contact: string;
        vehicleNumber?: string;
        address?: string; // for pickup/drop
    };

    @ManyToOne(() => Service, { nullable: true })
    service: Service;

    @Column({ nullable: true })
    serviceId: number;

    @Column("jsonb", { nullable: true })
    selectedAddOns: any[];

    @Column()
    timeSlot: string; // "2023-10-27 10:00:00"

    @Column({
        type: "enum",
        enum: BookingStatus,
        default: BookingStatus.UPCOMING,
    })
    status: BookingStatus;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Column("text", { nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
