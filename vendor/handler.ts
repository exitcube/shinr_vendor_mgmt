import {FastifyInstance,FastifyPluginOptions,FastifyRequest,FastifyReply } from "fastify";
import { APIError } from "../types/errors";
import { loginVendorBody, refreshRequestBody } from "./type";
import { Vendor, VendorToken } from "../models";
import bcrypt from "bcrypt";
import { RefreshTokenStatus, VendorAccountStatus } from "../utils/constant";
import { generateVendorRefreshToken, signVendorAccessToken, verifyVendorRefreshToken } from "../utils/jwt";
import { createSuccessResponse } from "../utils/response";

export default function controller(fastify: FastifyInstance,opts: FastifyPluginOptions,): any {
  return {
    loginVendorHandler: async (request: FastifyRequest<{ Body: loginVendorBody }>,reply: FastifyReply,) => {
      try {
        const { vendorCode, password } = request.body;
        const VendorRepo = fastify.db.getRepository(Vendor);
        const VendorTokenRepo = fastify.db.getRepository(VendorToken);

        const existingVendor = await VendorRepo.findOne({
          where: { vendorCode: vendorCode,isActive: true }
        });

        if (!existingVendor) {
          throw new APIError(
            "Vendor not found.",
            404,
            "VENDOR_NOT_FOUND",
            true,
            "Vendor not found.",
          );
        }
        if (existingVendor.accountStatus === "BLOCKED") {
          throw new APIError(
            "Vendor account is blocked.",
            403,
            "VENDOR_ACCOUNT_BLOCKED",
            true,
            "Your account is currently blocked. Please contact support for more information.",
          );
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          existingVendor.password,
        );

        if (!isPasswordValid) {
          throw new APIError(
            "Invalid password.",
            401,
            "INVALID_PASSWORD",
            true,
            "Invalid password.",
          );
        }
        await VendorRepo.update(
          { vendorCode: vendorCode },
          { isActive: true },
        );

        const vendorToken = await VendorTokenRepo.create({
          vendorId : existingVendor.id,
          refreshTokenStatus: RefreshTokenStatus.ACTIVE,
          isActive: true,
          refreshToken: "",
          accessToken: "",
        });
        await VendorTokenRepo.save(vendorToken);
        const refreshToken = await generateVendorRefreshToken({
          userUUID: existingVendor.uuid,
          tokenId: vendorToken.id,
        });
        const accessToken = await signVendorAccessToken({
          userUUID: existingVendor.uuid,
          vendorId: existingVendor.id,
          tokenId: vendorToken.id,
        });
        const refreshTokenExpiry = new Date(
          Date.now() +
            parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "60") *
              24 *
              60 *
              60 *
              1000,
        );
        vendorToken.refreshToken = refreshToken;
        vendorToken.accessToken = accessToken;
        vendorToken.refreshTokenExpiry = refreshTokenExpiry;
        await VendorTokenRepo.save(vendorToken);
        return reply
          .status(200)
          .send(
            createSuccessResponse({ accessToken, refreshToken },"Login Successfull"),
          );
      } catch (error) {
        throw new APIError(
          (error as APIError).message,
          (error as APIError).statusCode || 400,
          (error as APIError).code || "LOGIN_FAILED",
          true,
          (error as APIError).publicMessage || "Login failed.",
        );
      }
    },
    refreshTokenHandler: async (
          request: FastifyRequest<{ Body: refreshRequestBody }>,
          reply: FastifyReply
        ) => {
          try {
            const { refreshToken } = request.body as refreshRequestBody;

            const VendorTokenRepo = fastify.db.getRepository(VendorToken)
            const VendorRepo = fastify.db.getRepository(Vendor)

            const payload: any = await verifyVendorRefreshToken(refreshToken);
            const { userUUID, tokenId } = payload;

            const vendor = await VendorRepo.findOne({
              where: { uuid: userUUID, isActive: true },
            });
            if (!vendor) {
              throw new APIError(
                "Vendor not found.",
                404,
                "VENDOR_NOT_FOUND",
                true,
                "Vendor not found.",
              );
            }

            const existingVendorToken = await VendorTokenRepo.findOne({
              where: { id: tokenId },
            });
            if (!existingVendorToken) {
              throw new APIError(
                "Invalid refresh token.",
                401,
                "INVALID_REFRESH_TOKEN",
                true,
                "Invalid refresh token.",
              );
            }
            if(existingVendorToken.refreshToken !== refreshToken){
              throw new APIError(
                "Refresh token mismatch.",
                401,
                "REFRESH_TOKEN_MISMATCH",
                true,
                "Provided refresh token does not match.",
              );
            }
            if(existingVendorToken.refreshTokenStatus !== RefreshTokenStatus.ACTIVE){
                await VendorTokenRepo.update({id: existingVendorToken.id}, {refreshTokenStatus: RefreshTokenStatus.REVOKED});
                throw new APIError(
                  "Refresh token invalid state.",
                  401,
                  "REFRESH_TOKEN_INVALID_STATE",
                  true,
                  "Refresh token invalid state.",
                );
            }
            existingVendorToken.isActive = false;
            existingVendorToken.refreshTokenStatus = RefreshTokenStatus.USED
            await VendorTokenRepo.save(existingVendorToken);

            const newTokenRow = await VendorTokenRepo.create({
                vendorId: vendor.id,
                refreshTokenStatus: RefreshTokenStatus.ACTIVE,
                isActive: true,
                refreshToken: "",
                accessToken: "",
            })
            await VendorTokenRepo.save(newTokenRow);

            const newRefreshToken = await generateVendorRefreshToken({
                userUUID: vendor.uuid,
                tokenId: newTokenRow.id,
            })
            const newAccessToken = await signVendorAccessToken({
                userUUID: vendor.uuid,
                vendorId: vendor.id,
                tokenId: newTokenRow.id,
            })
            const refreshTokenExpiry = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '60') * 24 * 60 * 60 * 1000);
            newTokenRow.refreshToken = newRefreshToken;
            newTokenRow.accessToken = newAccessToken;
            newTokenRow.refreshTokenExpiry = refreshTokenExpiry;
            await VendorTokenRepo.save(newTokenRow);

            return reply.status(200).send(createSuccessResponse({ accessToken: newAccessToken, refreshToken: newRefreshToken }, "Token refreshed successfully."));

          }catch (error) {
        throw new APIError(
              (error as APIError).message,
              (error as APIError).statusCode || 400,
              (error as APIError).code || 'TOKEN_REFRESH_FAILED',
              true,
              (error as APIError).publicMessage || 'Failed to refresh token. Please login again.'
        );
      }
    },
  };
}
