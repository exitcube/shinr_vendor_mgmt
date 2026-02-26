
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

export type accessTokenPayloadType = {
  userId: number;
  userUUId: string;
  deviceUUId: string;
  tokenId: number;
}

export interface VendorAuthenticatedUser {
  vendorId: number;
  tokenId: number;
}

export interface VendorOrgAuthenticatedUser {
  vendorOrganizationId: number;
  tokenId: number;
}

export type vendorRefreshTokenPayloadType = {
  vendorId: number;
  tokenId: number;
}

export type vendorAccessTokenPayloadType = {
  vendorId: number;
  tokenId: number;
  deviceUUId: string;
}

export type vendorOrgRefreshTokenPayloadType = {
  vendorOrganizationId: number;
  organizationId: string;
  tokenId: number;
}

export type vendorOrgAccessTokenPayloadType = {
    vendorOrganizationId: number;
    tokenId: number;
}
