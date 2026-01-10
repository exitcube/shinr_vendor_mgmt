
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Vendor } from "./Vendor";

@Entity()
export class VendorDocument {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Vendor, (vendor) => vendor.documents, { onDelete: "CASCADE" })
    vendor: Vendor;

    @Column()
    vendorId: number;

    @Column({ type: "varchar", length: 100 })
    type: string; // license, gst, id_proof, bank, photo

    @Column("text")
    url: string;

    @Column({ default: "PENDING" })
    status: string; // PENDING, APPROVED, REJECTED

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
