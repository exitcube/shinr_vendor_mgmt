
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
// import { Vendor } from "./Vendor";

// @Entity()
// export class Review {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
//     vendor: Vendor;

//     @Column()
//     vendorId: number;

//     @Column()
//     customerId: string;

//     @Column({ type: "int" })
//     rating: number; // 1-5

//     @Column("text", { nullable: true })
//     comment: string;

//     @Column("text", { nullable: true })
//     reply: string;

//     @Column({ default: false })
//     isFlagged: boolean;

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;
// }
