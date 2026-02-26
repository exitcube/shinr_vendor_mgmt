
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
// import { Vendor } from "./Vendor";

// @Entity()
// export class Service {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @ManyToOne(() => Vendor, (vendor) => vendor.services, { onDelete: "CASCADE" })
//     vendor: Vendor;

//     @Column()
//     vendorId: number;

//     @Column({ type: "varchar", length: 255 })
//     name: string;

//     @Column({ type: "varchar", length: 100 })
//     category: string; // Car Wash, Polishing, etc.

//     @Column({ type: "varchar", length: 100 })
//     vehicleType: string; // Hatchback, Sedan, SUV, etc.

//     @Column("int")
//     duration: number; // in minutes

//     @Column("decimal", { precision: 10, scale: 2 })
//     price: number;

//     @Column("decimal", { precision: 10, scale: 2, default: 0 })
//     discount: number;

//     @Column("text", { nullable: true })
//     image: string;

//     @Column("text", { nullable: true })
//     description: string;

//     @Column("jsonb", { nullable: true })
//     addOns: { name: string; price: number }[];

//     @Column("jsonb", { nullable: true })
//     resources: any; // required resources

//     @Column({ default: false })
//     isFeatured: boolean;

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;
// }
