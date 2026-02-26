import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,JoinColumn,ManyToOne,Generated,Index} from "typeorm";
import { Vendor } from "./Vendor";


@Entity("vendorToken")
export class VendorToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()     
    @Generated("uuid")
    @Index()
    uuid: string;

    @Column()
    @Index()
    vendorId: number;
  
    @ManyToOne(() => Vendor, { onDelete: "CASCADE" })
    @JoinColumn({ name: "vendorId" })
    user: Vendor;

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