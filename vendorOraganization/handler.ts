import {FastifyInstance,FastifyPluginOptions,FastifyRequest,FastifyReply } from "fastify";
import { APIError } from "../types/errors";
import { loginVendorOrganizationBody, refreshRequestBody } from "./type";
import { VendorOrganization, VendorOrganizationToken } from "../models";
import bcrypt from "bcrypt";
import { RefreshTokenStatus } from "../utils/constant";
import { generateVendorOrgRefreshToken, signVendorOrgAccessToken, verifyVendorOrgRefreshToken } from "../utils/jwt";
import { createSuccessResponse } from "../utils/response";

export default function controller(fastify: FastifyInstance,opts: FastifyPluginOptions,): any {
  return {
    loginVendorOrgHandler: async (request: FastifyRequest<{ Body: loginVendorOrganizationBody }>,reply: FastifyReply,) => {
      try {
        const { organizationId, password } = request.body as loginVendorOrganizationBody;
        const VendorOrgRepo = fastify.db.getRepository(VendorOrganization);
        const VendorOrgTokenRepo = fastify.db.getRepository(VendorOrganizationToken);

        const existingVendorOrg = await VendorOrgRepo.findOne({
          where: { organizationId: organizationId },
        });

        if (!existingVendorOrg) {
          throw new APIError(
            "Vendor organization not found.",
            404,
            "VENDOR_ORGANIZATION_NOT_FOUND",
            true,
            "Vendor organization not found.",
          );
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          existingVendorOrg.password,
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
        await VendorOrgRepo.update(
          { organizationId: organizationId },
          { isActive: true },
        );

        const vendorOrgToken = await VendorOrgTokenRepo.create({
          vendorOrganizationId : existingVendorOrg.id,
          refreshTokenStatus: RefreshTokenStatus.ACTIVE,
          isActive: true,
          refreshToken: "",
          accessToken: "",
        });
        await VendorOrgTokenRepo.save(vendorOrgToken);
        const refreshToken = await generateVendorOrgRefreshToken({
          vendorOrganizationId: existingVendorOrg.id,
          organizationId: existingVendorOrg.organizationId,
          tokenId: vendorOrgToken.id,
        });
        const accessToken = await signVendorOrgAccessToken({
          vendorOrganizationId: existingVendorOrg.id,
          tokenId: vendorOrgToken.id,
        });
        const refreshTokenExpiry = new Date(
          Date.now() +
            parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "60") *
              24 *
              60 *
              60 *
              1000,
        );
        vendorOrgToken.refreshToken = refreshToken;
        vendorOrgToken.accessToken = accessToken;
        vendorOrgToken.refreshTokenExpiry = refreshTokenExpiry;
        await VendorOrgTokenRepo.save(vendorOrgToken);
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

            const VendorOrgTokenRepo = fastify.db.getRepository(VendorOrganizationToken)
            const VendorOrgRepo = fastify.db.getRepository(VendorOrganization)

            const payload: any = await verifyVendorOrgRefreshToken(refreshToken);
            const { vendorOrganizationId, tokenId } = payload;

            const existingVendorOrg = await VendorOrgRepo.findOne({
              where: { id: vendorOrganizationId },
            });
            if (!existingVendorOrg) {
              throw new APIError(
                "Vendor organization not found.",
                404,
                "VENDOR_ORGANIZATION_NOT_FOUND",
                true,
                "Vendor organization not found.",
              );
            }

            const existingVendorOrgToken = await VendorOrgTokenRepo.findOne({
              where: { id: tokenId },
            });
            if (!existingVendorOrgToken) {
              throw new APIError(
                "Invalid refresh token.",
                401,
                "INVALID_REFRESH_TOKEN",
                true,
                "Invalid refresh token.",
              );
            }
            if(existingVendorOrgToken.refreshToken !== refreshToken){
              throw new APIError(
                "Refresh token mismatch.",
                401,
                "REFRESH_TOKEN_MISMATCH",
                true,
                "Provided refresh token does not match.",
              );
            }
            if(existingVendorOrgToken.refreshTokenStatus !== RefreshTokenStatus.ACTIVE){
                await VendorOrgTokenRepo.update({id: existingVendorOrgToken.id}, {refreshTokenStatus: RefreshTokenStatus.REVOKED});
                throw new APIError(
                  "Refresh token invalid state.",
                  401,
                  "REFRESH_TOKEN_INVALID_STATE",
                  true,
                  "Refresh token invalid state.",
                );
            }
            existingVendorOrgToken.isActive = false;
            existingVendorOrgToken.refreshTokenStatus = RefreshTokenStatus.USED
            await VendorOrgTokenRepo.save(existingVendorOrgToken);

            const newTokenRow = await VendorOrgTokenRepo.create({
                vendorOrganizationId: existingVendorOrg.id,
                refreshTokenStatus: RefreshTokenStatus.ACTIVE,
                isActive: true,
                refreshToken: "",
                accessToken: "",
            })
            await VendorOrgTokenRepo.save(newTokenRow);

            const newRefreshToken = await generateVendorOrgRefreshToken({
                vendorOrganizationId: existingVendorOrg.id,
                organizationId: existingVendorOrg.organizationId,
                tokenId: newTokenRow.id,
            })
            const newAccessToken = await signVendorOrgAccessToken({
                vendorOrganizationId: existingVendorOrg.id,
                tokenId: newTokenRow.id,
            })
            const refreshTokenExpiry = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '60') * 24 * 60 * 60 * 1000);
            newTokenRow.refreshToken = newRefreshToken;
            newTokenRow.accessToken = newAccessToken;
            newTokenRow.refreshTokenExpiry = refreshTokenExpiry;
            await VendorOrgTokenRepo.save(newTokenRow);

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
