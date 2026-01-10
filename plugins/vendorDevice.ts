
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Vendor, VendorDevice } from '../models';
import { DataSource } from 'typeorm';
import { validate as isUUID } from 'uuid';

interface VendorDeviceParams {
  vendorUUID?: string;
  vendorId?: number;
  deviceUUID?: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    db: DataSource;
    getVendorDeviceInfo: (params: VendorDeviceParams) => Promise<Vendor | null>;
  }
}

const vendorDevicePlugin: FastifyPluginAsync = async (fastify) => {
  try {
    fastify.decorate(
      'getVendorDeviceInfo',
      async ({ vendorUUID, vendorId, deviceUUID }: VendorDeviceParams) => {

        if (!vendorUUID && !vendorId) {
          throw new Error('Either vendorUUID or vendorId is required');
        }

        const vendorRepo = fastify.db.getRepository(Vendor);

        const where: any = { isActive: true };
        if (vendorUUID) {
          if (!isUUID(vendorUUID)) throw new Error('Invalid vendorUUID format');
          where.uuid = vendorUUID;
        } else if (vendorId) {
          where.id = vendorId;
        }

        if (deviceUUID) {
          where.device = { uuid: deviceUUID, isActive: true };
        }

        // Fetch vendor + device relation
        const vendor = await vendorRepo.findOne({
          where,
          relations: ['device'], // fetch vendor and related device data
        });

        return vendor;
      }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default fp(vendorDevicePlugin, { name: 'vendorDevicePlugin' });