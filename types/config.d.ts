
import 'fastify';
import { Vendor } from '../models';

declare module 'fastify' {
  interface FastifyInstance {
    db: DataSource;
    throwAPIError: (error: APIError) => never;
    config: {
      port: number;
      nodeEnv: string;
      appName: string;
    };

  }
}

declare module 'fastify' {
  interface FastifyRequest {
    deviceId?: string;
  }
}


// Define interfaces for the return types
export interface VendorInfo {
  id: number;
  uuid: string;
  businessName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceInfo {
  id: number;
  uuid: string;
  vendorId: number;
  lastLogin: Date;
  lastActive: Date;
  userAgent: string;
  lastLogoutTime: Date;
  ipAddress: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorDeviceData {
  vendor: VendorInfo | null;
  device: DeviceInfo | null;
}

export interface AuthenticatedUser {
  userId: number;
  userUUId: string;
  deviceUUId: string;
  tokenId: number;
}

export interface AdminAuthenticatedUser {
  userId: number;
  userUUId: string;
  tokenId: number;
  role: string,
}

export type adminRefreshTokenPayloadType = {
  tokenId: number;
  userUUId: string;
  role: string | unknown;
}

export type adminAccessTokenPayloadType = {
  userId: number;
  userUUId: string;
  tokenId: number;
  role: string;
}

 

export interface VendorOrgAuthenticatedUser {
  vendorOrgId: number;
  tokenId: number;
}

export type vendorOrgRefreshTokenPayloadType = {
  userUUId: string;
  vendorOrgId: number;
  tokenId: number;
}

export type vendorOrgAccessTokenPayloadType = {
  vendorOrgId: number;
  tokenId: number;
  userUUId: string;

}

export type vendorOrgOtpTokenPayloadType = {
  tokenId: number;
  userUUId: string;
}

 