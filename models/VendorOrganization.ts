import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,JoinColumn,OneToOne,ManyToOne,Generated,Index} from "typeorm";


@Entity("vendorOrganization")
export class VendorOrganization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated("uuid")
    @Index()
    uuid: string;

    @Column({ nullable: false }) 
    vendorOrgCode: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: false, unique: true })
    mobile: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    accountStatus: string;

    @Column({ type: "timestamp", nullable: true })
    lastActive: Date;

    @Column({ default: false })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}