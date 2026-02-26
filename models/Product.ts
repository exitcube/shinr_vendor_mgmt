
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
// import { Vendor } from "./Vendor";

// @Entity()
// export class Product {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @ManyToOne(() => Vendor, (vendor) => vendor.products, { onDelete: "CASCADE" })
//     vendor: Vendor;

//     @Column()
//     vendorId: number;

//     @Column({ type: "varchar", length: 255 })
//     name: string;

//     @Column({ type: "varchar", length: 100 })
//     category: string;

//     @Column("text", { nullable: true })
//     image: string;

//     @Column("decimal", { precision: 10, scale: 2 })
//     mrp: number;

//     @Column("decimal", { precision: 10, scale: 2 })
//     sellingPrice: number;

//     @Column("int")
//     stockQuantity: number;

//     @Column({ type: "varchar", length: 100, nullable: true })
//     sku: string;

//     @Column("text", { nullable: true })
//     description: string;

//     @Column("jsonb", { nullable: true })
//     shippingInfo: { time: string; method: string };

//     @Column("decimal", { precision: 10, scale: 2, default: 0 })
//     discount: number;

//     @Column("jsonb", { nullable: true })
//     variants: any[];

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;
// }
