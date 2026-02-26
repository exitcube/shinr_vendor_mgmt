import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,JoinColumn,OneToOne,ManyToOne,Generated,Index} from "typeorm";
import { Vendor } from "./Vendor";


@Entity("vendorOrganization")
export class VendorOrganization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "userId" })
    @Index()
    vendorId: number;
  
    @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
    @JoinColumn({ name: "vendorId" })
    user: Vendor;

    @Column({ nullable: true })
    organizationName: string;

    @Column({ unique: true,nullable: false })
    organizationId: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    contactMobile: number;

    @Column({ nullable: true })
    contactEmail: string;

    @Column({ nullable: true })
    address: string;

    @Column({length: 100,nullable: true })
    country: string;

    @Column({length: 100 ,nullable: true})
    city: string;

    @Column({ length: 100,nullable: true })
    state: string;

    @Column({length: 20,nullable: true })
    pinCode: string;

    @Column({ type: 'decimal', precision: 10, scale: 5, nullable: false })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 5, nullable: false })
    longitude: number;

    @Column({ nullable: true})  
    openingTime: string;

    @Column({ nullable: true})  
    closingTime: string;

    @Column({ nullable: true })
    status: string;

    @Column({ default: false })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}