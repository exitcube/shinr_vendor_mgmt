
import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { registerVendorBody, loginVendorBody } from './type';
import bcrypt from "bcrypt";
import { generateVendorRefreshToken, signVendorAccessToken } from '../utils/jwt';
import { createSuccessResponse } from '../utils/response';
import { APIError } from '../types/errors';
import { RefreshTokenStatus } from '../models/VendorToken';
import { Vendor, VendorToken, VendorDevice } from "../models/index";
import { validate as isUUID } from 'uuid';

export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions): any {
    return {
        registerVendorHandler: async (request: FastifyRequest<{ Body: registerVendorBody }>, reply: FastifyReply) => {
            try {
                const { businessName, ownerName, phone, email, password, location, serviceType } = request.body;
                const vendorRepo = fastify.db.getRepository(Vendor);

                const existingVendor = await vendorRepo.findOne({ where: [{ phone }, { email: email || "" }] });
                if (existingVendor) {
                    throw new APIError("Vendor already exists", 400, "VENDOR_EXISTS", true, "Vendor with this phone or email already exists");
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newVendor = vendorRepo.create({
                    businessName,
                    ownerName,
                    phone,
                    email,
                    password: hashedPassword,
                    location,
                    serviceType,
                    isActive: true
                });

                await vendorRepo.save(newVendor);

                return reply.status(201).send(createSuccessResponse({ vendorId: newVendor.id }, "Vendor registered successfully"));

            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 400,
                    (error as APIError).code || "REGISTER_FAILED",
                    true,
                    (error as APIError).publicMessage || "Failed to register vendor."
                );
            }
        },

        loginVendorHandler: async (request: FastifyRequest<{ Body: loginVendorBody }>, reply: FastifyReply) => {
            try {
                const { identifier, password } = request.body;
                const deviceId = request.headers['x-device-id'] as string; // Expect device ID in header

                if (!deviceId) {
                    throw new APIError("Device ID missing", 400, "MISSING_DEVICE_ID", true, "x-device-id header is required");
                }

                const vendorRepo = fastify.db.getRepository(Vendor);
                const tokenRepo = fastify.db.getRepository(VendorToken);
                const deviceRepo = fastify.db.getRepository(VendorDevice);

                const vendor = await vendorRepo.findOne({
                    where: [
                        { phone: identifier },
                        { email: identifier }
                    ],
                    relations: ['device']
                });

                if (!vendor) {
                    throw new APIError("Vendor not found", 400, "VENDOR_NOT_FOUND", false, "Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(password, vendor.password);
                if (!isPasswordValid) {
                    throw new APIError("Invalid password", 401, "INVALID_PASSWORD", false, "Invalid credentials");
                }

                // Device Logic
                let vendorDevice = await deviceRepo.findOne({ where: { vendorId: vendor.id } });

                // If device exists but UUID mismatch? Or just update it?
                // For simplicity, we create one if not exists, or update.
                // Or if we strictly follow uuid flow:

                if (!vendorDevice) {
                    vendorDevice = deviceRepo.create({
                        vendorId: vendor.id,
                        deviceId: deviceId, // This might be a physical device ID or similar
                        isActive: true,
                        lastLogin: new Date(),
                        lastActive: new Date(),
                        // uuid is auto-generated
                    });
                    await deviceRepo.save(vendorDevice);

                    // We need the generated UUID for the token
                    // But wait, vendorDevice.uuid is generated on insert.
                } else {
                    vendorDevice.lastLogin = new Date();
                    vendorDevice.lastActive = new Date();
                    vendorDevice.deviceId = deviceId; // Update physical device ID mapping
                    await deviceRepo.save(vendorDevice);
                }

                const vendorToken = tokenRepo.create({
                    vendorId: vendor.id,
                    refreshTokenStatus: RefreshTokenStatus.ACTIVE,
                    isActive: true,
                    refreshToken: "",
                    accessToken: "",
                });
                await tokenRepo.save(vendorToken);

                const refreshToken = await generateVendorRefreshToken({
                    vendorId: vendor.id,
                    tokenId: vendorToken.id,
                });

                const accessToken = await signVendorAccessToken({
                    vendorId: vendor.id,
                    tokenId: vendorToken.id,
                    deviceUUId: vendorDevice.uuid // Use the VendorDevice UUID
                });

                const refreshTokenExpiry = new Date(
                    Date.now() +
                    parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "60") *
                    24 * 60 * 60 * 1000
                );

                vendorToken.refreshToken = refreshToken;
                vendorToken.accessToken = accessToken;
                vendorToken.refreshTokenExpiry = refreshTokenExpiry;
                await tokenRepo.save(vendorToken);

                return reply.status(200).send(createSuccessResponse({ accessToken, refreshToken, vendor, deviceUUId: vendorDevice.uuid }, "Login successful"));

            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 400,
                    (error as APIError).code || "LOGIN_FAILED",
                    true,
                    (error as APIError).publicMessage || "Login failed."
                );
            }
        }
    };
}
