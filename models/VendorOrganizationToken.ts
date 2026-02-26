import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,JoinColumn,OneToOne,ManyToOne,Generated,Index} from "typeorm";
import { Vendor } from "./Vendor";
import { VendorOrganization } from "./VendorOrganization";


@Entity("vendorOrganizationToken")
export class VendorOrganizationToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()  
    @Generated("uuid")
    @Index()
    uuid: string;

    @Column({ name: "vendorOrganizationId" })
    @Index()
    vendorOrganizationId: number;
  
    @ManyToOne(() => VendorOrganization, { onDelete: "CASCADE" })  
    @JoinColumn({ name: "vendorOrganizationId" })
    vendorOrganization: VendorOrganization;

    @Column({ type: 'text', nullable: false })
    refreshToken: string;

    @Column({ nullable: false , unique: true})
    accessToken: string;

    @Column({ type: 'timestamp', nullable: true })
    refreshTokenExpiry: Date | null;

    @Column()
    refreshTokenStatus: string;

    @Column({ default: false })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}