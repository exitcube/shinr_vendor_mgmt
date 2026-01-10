
import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorSystem1762950000000 implements MigrationInterface {
    name = 'VendorSystem1762950000000'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // Create Vendor Table
        await queryRunner.query(`CREATE TABLE "vendor" (
            "id" SERIAL NOT NULL, 
            "businessName" character varying(255) NOT NULL, 
            "ownerName" character varying(255) NOT NULL, 
            "phone" character varying(20) NOT NULL, 
            "email" character varying(255), 
            "password" character varying(255) NOT NULL, 
            "gst" character varying(100), 
            "location" jsonb, 
            "serviceType" text, 
            "verificationStatus" character varying NOT NULL DEFAULT 'PENDING', 
            "profileCompleted" boolean NOT NULL DEFAULT false, 
            "shopDetails" jsonb, 
            "availabilitySettings" jsonb, 
            "isActive" boolean NOT NULL DEFAULT true, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "UQ_vendor_phone" UNIQUE ("phone"), 
            CONSTRAINT "PK_vendor_id" PRIMARY KEY ("id")
        )`);

        // Create VendorToken Table
        await queryRunner.query(`CREATE TABLE "vendor_token" (
            "id" SERIAL NOT NULL, 
            "vendorId" integer NOT NULL, 
            "refreshTokenStatus" character varying NOT NULL DEFAULT 'ACTIVE', 
            "isActive" boolean NOT NULL DEFAULT true, 
            "refreshToken" text NOT NULL, 
            "accessToken" text NOT NULL, 
            "refreshTokenExpiry" TIMESTAMP NOT NULL, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_vendor_token_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_vendor_token_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE
        )`);

        // Create VendorDocument Table
        await queryRunner.query(`CREATE TABLE "vendor_document" (
            "id" SERIAL NOT NULL,
            "vendorId" integer NOT NULL,
            "type" character varying(100) NOT NULL,
            "url" text NOT NULL,
            "status" character varying NOT NULL DEFAULT 'PENDING',
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_vendor_document_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_vendor_document_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE
        )`);

        // Create Service Table
        await queryRunner.query(`CREATE TABLE "service" (
            "id" SERIAL NOT NULL,
            "vendorId" integer NOT NULL,
            "name" character varying(255) NOT NULL,
            "category" character varying(100) NOT NULL,
            "vehicleType" character varying(100) NOT NULL,
            "duration" integer NOT NULL,
            "price" numeric(10,2) NOT NULL,
            "discount" numeric(10,2) NOT NULL DEFAULT '0',
            "image" text,
            "description" text,
            "addOns" jsonb,
            "resources" jsonb,
            "isFeatured" boolean NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_service_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_service_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE
        )`);

        // Create Product Table
        await queryRunner.query(`CREATE TABLE "product" (
            "id" SERIAL NOT NULL,
            "vendorId" integer NOT NULL,
            "name" character varying(255) NOT NULL,
            "category" character varying(100) NOT NULL,
            "image" text,
            "mrp" numeric(10,2) NOT NULL,
            "sellingPrice" numeric(10,2) NOT NULL,
            "stockQuantity" integer NOT NULL,
            "sku" character varying(100),
            "description" text,
            "shippingInfo" jsonb,
            "discount" numeric(10,2) NOT NULL DEFAULT '0',
            "variants" jsonb,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_product_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_product_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE
        )`);

        // Create Booking Table
        await queryRunner.query(`CREATE TABLE "booking" (
            "id" SERIAL NOT NULL,
            "vendorId" integer NOT NULL,
            "customerId" character varying,
            "customerDetails" jsonb NOT NULL,
            "serviceId" integer,
            "selectedAddOns" jsonb,
            "timeSlot" character varying NOT NULL,
            "status" character varying NOT NULL DEFAULT 'UPCOMING',
            "paymentStatus" character varying NOT NULL DEFAULT 'PENDING',
            "notes" text,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_booking_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_booking_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_booking_service" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE SET NULL
        )`);

        // Create Order Table
        await queryRunner.query(`CREATE TABLE "order" (
            "id" SERIAL NOT NULL,
            "vendorId" integer NOT NULL,
            "buyerId" character varying NOT NULL,
            "buyerDetails" jsonb NOT NULL,
            "productId" integer,
            "quantity" integer NOT NULL,
            "totalPrice" numeric(10,2) NOT NULL,
            "status" character varying NOT NULL DEFAULT 'PENDING',
            "shippingMethod" character varying,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_order_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_order_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_order_product" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL
        )`);

        // Create Review Table
        await queryRunner.query(`CREATE TABLE "review" (
            "id" SERIAL NOT NULL,
            "vendorId" integer NOT NULL,
            "customerId" character varying NOT NULL,
            "rating" integer NOT NULL,
            "comment" text,
            "reply" text,
            "isFlagged" boolean NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_review_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_review_vendor" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TABLE "vendor_document"`);
        await queryRunner.query(`DROP TABLE "vendor_token"`);
        await queryRunner.query(`DROP TABLE "vendor"`);
    }

}
