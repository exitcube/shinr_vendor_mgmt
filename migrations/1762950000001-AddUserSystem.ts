
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserSystem1762950000001 implements MigrationInterface {
    name = 'AddUserSystem1762950000001'


    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add UUID to Vendor Table
        await queryRunner.query(`ALTER TABLE "vendor" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`CREATE INDEX "IDX_vendor_uuid" ON "vendor" ("uuid")`);

        // Create VendorDevice Table
        await queryRunner.query(`CREATE TABLE "vendor_device" (
            "id" SERIAL NOT NULL,
            "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "vendorId" integer NOT NULL,
            "deviceId" character varying(255),
            "fcmToken" character varying(255),
            "lastLogin" TIMESTAMP,
            "lastActive" TIMESTAMP,
            "userAgent" character varying(255),
            "ipAddress" character varying(50),
            "isActive" boolean NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_vendor_device_id" PRIMARY KEY ("id"),
            CONSTRAINT "REL_vendor_device_vendor" UNIQUE ("vendorId"),
            CONSTRAINT "FK_vendor_device_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_vendor_device_uuid" ON "vendor_device" ("uuid")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vendor_device"`);
        await queryRunner.query(`ALTER TABLE "vendor" DROP COLUMN "uuid"`);
    }

}
