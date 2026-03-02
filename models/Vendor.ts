import { Entity, PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,JoinColumn,OneToOne,ManyToOne,Generated,Index} from "typeorm";
import { VendorFile } from "./VendorFile";
import { VendorOrganization } from "./VendorOrganization";

@Entity("vendor")
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  @Index()
  uuid: string;

  @Column({ name: "vendorOrgId" })
  @Index()
  vendorOrgId: number;
  
  @ManyToOne(() => VendorOrganization, { onDelete: "CASCADE" })  
  @JoinColumn({ name: "vendorOrgId" })
  vendorOrganization: VendorOrganization;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false, unique: true })
  mobile: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: "timestamp", nullable: true })
  lastActive: Date;

  @Column({ nullable: true })
  profilePicId: number;

  @OneToOne(() => VendorFile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profilePicId" })
  vendorFile: VendorFile;

  @Column({ nullable: false }) 
  vendorCode: string;

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

  @Column({ nullable: true })
  accountStatus: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}