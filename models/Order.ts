
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
// import { Vendor } from "./Vendor";
// import { Product } from "./Product";

// export enum OrderStatus {
//     PENDING = "PENDING",
//     PACKED = "PACKED",
//     SHIPPED = "SHIPPED",
//     DELIVERED = "DELIVERED",
//     CANCELLED = "CANCELLED",
// }

// @Entity()
// export class Order {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
//     vendor: Vendor;

//     @Column()
//     vendorId: number;

//     @Column()
//     buyerId: string; // User ID

//     @Column("jsonb")
//     buyerDetails: {
//         name: string;
//         address: string;
//         contact: string;
//     };

//     @ManyToOne(() => Product, { nullable: true })
//     product: Product;

//     @Column({ nullable: true })
//     productId: number;

//     @Column("int")
//     quantity: number;

//     @Column("decimal", { precision: 10, scale: 2 })
//     totalPrice: number;

//     @Column({
//         type: "enum",
//         enum: OrderStatus,
//         default: OrderStatus.PENDING,
//     })
//     status: OrderStatus;

//     @Column({ nullable: true })
//     shippingMethod: string; // Vendor-managed / Marketplace logistics

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;
// }
