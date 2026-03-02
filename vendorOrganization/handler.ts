
import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { LoginRequestBody, refreshRequestBody, verifyOtpRequestBody } from './type';
import { VendorOrganization, VendorOrganizationToken } from '../models';
import { VendorOrgOtp } from '../models/VendorOrgOtp';
import { APIError } from '../types/errors';
import { generateOtp } from '../utils/helper';
import { generateVendorOrgOtpToken, generateVendorOrgRefreshToken, signVendorOrgAccessToken, verifyVendorOrgOtpToken, verifyVendorOrgRefreshToken } from '../utils/jwt';
import { createSuccessResponse } from '../utils/response';
import { RefreshTokenStatus } from '../utils/constant';
 

export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions): any {
    return {
         generateOtpHandler: async (request: FastifyRequest<{ Body: LoginRequestBody }>, reply: FastifyReply) => {
            try {
                const { mobile } = request.body;

             
                const vendorOrgRepo = fastify.db.getRepository(VendorOrganization);;
                const vendorOrgOtpRepo = fastify.db.getRepository(VendorOrgOtp);


                let vendorOrg = await vendorOrgRepo.findOne({ where: { mobile, isActive: true } });
                 if (!vendorOrg) {
                     throw new APIError(
                        "Invalid mobile number",
                        400,
                        "INVALID_MOBILE_NUMBER",
                        false,
                        "The mobile number provided is not registered with us."
                    );
                 }
                 if(vendorOrg.accountStatus === "BLOCKED"){
                    throw new APIError(
                        "Account blocked",
                        403,
                        "ACCOUNT_BLOCKED",
                        false,
                        "Your account has been blocked. Please contact support for assistance."
                    );
                 }

                vendorOrg.lastActive = new Date();
                await vendorOrgRepo.save(vendorOrg);
                const otp = generateOtp();
                const vendorOrgOtp = vendorOrgOtpRepo.create({
                    vendorOrgId: vendorOrg.id,
                    otp,
                    lastRequestedTime: new Date(),
                    requestCount: 1,
                    otpToken: ""
                });
                 await vendorOrgOtpRepo.save(vendorOrgOtp);
                const otpToken = await generateVendorOrgOtpToken({
                    // userId: user.id,
                    tokenId: vendorOrgOtp.id,
                    userUUId: vendorOrg.uuid,
                    
                });
                vendorOrgOtp.otpToken = otpToken;
                await vendorOrgOtpRepo.save(vendorOrgOtp);

                const result = createSuccessResponse({ otpToken }, "OTP generated");
                return reply.status(200).send(result);

            } catch (error) {
                if (error instanceof APIError) throw error;
                throw new APIError(
                    (error as APIError).message,
                    500,
                    "OTP_GENERATION_FAILED",
                    true,
                    "Failed to generate OTP. Please try again later."
                );
            }
        },
        verifyOtpHandler: async (request: FastifyRequest<{ Body: verifyOtpRequestBody }>, reply: FastifyReply) => {
            try {
                const { otpToken, otp } = request.body;
               
                const vendorOrgRepo = fastify.db.getRepository(VendorOrganization);
                const vendorOrgOtpRepo = fastify.db.getRepository(VendorOrgOtp);
                const vendorOrgTokenRepo = fastify.db.getRepository(VendorOrganizationToken);
                

                
                const payload = await verifyVendorOrgOtpToken(otpToken);
                console.log("payload", payload);
                
                const vendorOrg = await vendorOrgRepo.findOne({
                    where: { uuid: payload.userUUId, isActive: true },
                });
                if (!vendorOrg) {
                    throw new APIError(
                        "User not found",
                        400,
                        "USER_NOT_FOUND",
                        false,
                        "User does not exist. Please register."
                    );
                }
                const otpRecord = await vendorOrgOtpRepo.findOne({
                    where: { id :payload.tokenId, vendorOrgId: vendorOrg.id,  isActive: true },
                });

                if (otpRecord?.otpToken !== otpToken) {
                    throw new APIError(
                        "Invalid OTP token",
                        400,
                        "INVALID_OTP_TOKEN",
                        false,
                        "The provided OTP token is invalid. Please login again."
                    );
                }
                const DEV_OTP = process.env.NODE_ENV === "development" ? process.env.DEV_OTP || "1234" : null;
                if (otp !== DEV_OTP && otpRecord?.otp !== otp) {
                    throw new APIError(
                        "Incorrect OTP",
                        400,
                        "INVALID_OTP",
                        false,
                        "The provided OTP is invalid. Please request a new OTP."
                    );
                }
                await vendorOrgTokenRepo.update(
                    { vendorOrganizationId: vendorOrg.id,   isActive: true }, // condition
                    {
                        isActive: false,
                        refreshTokenStatus: RefreshTokenStatus.INACTIVE
                    } 
                );
                const vendorOrgToken = vendorOrgTokenRepo.create({
                    vendorOrganizationId: vendorOrg.id,
                    refreshTokenStatus: RefreshTokenStatus.ACTIVE,
                    isActive: true,
                    refreshToken: "",
                    accessToken: ""
                });

                await vendorOrgTokenRepo.save(vendorOrgToken);

                const refreshToken = await generateVendorOrgRefreshToken({ userUUId: vendorOrg.uuid,   tokenId: vendorOrgToken.id,vendorOrgId: vendorOrg.id });
                const accessToken = await signVendorOrgAccessToken({ vendorOrgId: vendorOrg.id, userUUId: vendorOrg.uuid,  tokenId: vendorOrgToken.id});
                console.log(refreshToken, accessToken);
                const refreshTokenExpiry = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || "60") * 24 * 60 * 60 * 1000);
                vendorOrgToken.refreshToken = refreshToken;
                vendorOrgToken.accessToken = accessToken;
                vendorOrgToken.refreshTokenExpiry = refreshTokenExpiry;
                await vendorOrgTokenRepo.save(vendorOrgToken);
                otpRecord.isActive = false;
                await vendorOrgOtpRepo.save(otpRecord);
                const result = createSuccessResponse({ accessToken, refreshToken }, "OTP verified and tokens generated");
                return reply.status(200).send(result);



            } catch (error) {
                throw new APIError(
                    (error as APIError).message,
                    (error as APIError).statusCode || 400,
                    (error as APIError).code || "OTP_VERIFICATION_FAILED",
                    true,
                    (error as APIError).publicMessage || "Failed to verify OTP. Please try again later."
                );
            }
        },
        resendOtpHandler: async (request: FastifyRequest<{ Body: { otpToken: string } }>, reply: FastifyReply ) => {
          try {
            const { otpToken } = request.body;
             
            
            const vendorOrgOtpRepo = fastify.db.getRepository(VendorOrgOtp);
    
            const payload = await verifyVendorOrgOtpToken(otpToken);
            const { userUUId,tokenId } = payload;
    
        
            const otpRecord = await vendorOrgOtpRepo.findOne({
              where: { id:tokenId, isActive: true },
            });
    
            if (!otpRecord) {
              throw new APIError(
                "No active OTP request",
                400,
                "NO_ACTIVE_OTP",
                false,
                "No active OTP found for this device. Please initiate login again."
              );
            }     
            if (otpRecord.requestCount > 5) {
              otpRecord.isActive = false;
              await vendorOrgOtpRepo.save(otpRecord);
              throw new APIError(
                "OTP limit exceeded",
                429,
                "OTP_LIMIT_EXCEEDED",
                false,
                "Too many OTP requests. Try again later."
              );
            } 
            const secondsSinceLastRequest = Math.floor((Date.now() - new Date(otpRecord.lastRequestedTime).getTime()) / 1000);
            if (secondsSinceLastRequest < 45) {
              const waitSeconds = 45 - secondsSinceLastRequest;
              throw new APIError(
                "OTP resend cooldown",
                429,
                "OTP_RESEND_COOLDOWN",
                false,
               ` Please wait ${waitSeconds} seconds before requesting a new OTP.`
              );
            }
          
            const newOtp = generateOtp();
            const newOtpToken = await generateVendorOrgOtpToken({tokenId,userUUId});

              otpRecord.otp = newOtp;
              otpRecord.otpToken = newOtpToken;
              otpRecord.lastRequestedTime = new Date();
              otpRecord.requestCount += 1;
    
            await vendorOrgOtpRepo.save(otpRecord);
    
            const result = createSuccessResponse(
              { otpToken: otpRecord.otpToken },
              "OTP resent successfully"
            );
            return reply.status(200).send(result);
          } catch (error) {
            throw new APIError(
              (error as APIError).message,
              (error as APIError).statusCode || 400,
              (error as APIError).code || "OTP_RESEND_FAILED",
              true,
              (error as APIError).publicMessage ||
                "Failed to resend OTP. Please try again later."
            );
          }
        },
         generateRefreshTokenHandler: async ( request: FastifyRequest<{ Body: refreshRequestBody }>, reply: FastifyReply) => {
          try {
            const { refreshToken } = request.body;

            const vendorOrgTokenRepo = fastify.db.getRepository(VendorOrganizationToken);
            const vendorOrgRepo = fastify.db.getRepository(VendorOrganization);

            const payload: any = await verifyVendorOrgRefreshToken(refreshToken);
            const { userUUId,  tokenId } = payload;

            const vendorOrg = await vendorOrgRepo.findOne({ where: { uuid: userUUId, isActive: true } });
            if (!vendorOrg) {
              throw new APIError('User not found', 404, 'USER_NOT_FOUND', false, 'The user associated with this token does not exist.');
            }

            const existing = await vendorOrgTokenRepo.findOne({ where: { id: tokenId, } });
            if (!existing) {
              throw new APIError('Refresh token not found', 400, 'REFRESH_TOKEN_NOT_FOUND', false, 'Invalid or inactive refresh token.');
            }
     
            if (existing.refreshToken !== refreshToken) {
              throw new APIError('Refresh token mismatch', 400, 'REFRESH_TOKEN_MISMATCH', false, 'Provided refresh token does not match.');
            }

            if (existing.refreshTokenStatus !== RefreshTokenStatus.ACTIVE) {
              await vendorOrgTokenRepo.update( { id: existing.id },{ refreshTokenStatus: RefreshTokenStatus.REVOKED });
              throw new APIError('Refresh token invalid state', 400, 'REFRESH_TOKEN_INVALID_STATE', false, 'Refresh token is not active.');
            }


            existing.isActive = false;
            existing.refreshTokenStatus = RefreshTokenStatus.USED;
            await vendorOrgTokenRepo.save(existing);

          
            const newTokenRow = vendorOrgTokenRepo.create({
              vendorOrganizationId: vendorOrg.id,
              deviceId: existing.deviceId,
              refreshTokenStatus: RefreshTokenStatus.ACTIVE,
              isActive: true,
              refreshToken: '',
              accessToken: ''
            });
            await vendorOrgTokenRepo.save(newTokenRow);
             
            const newRefreshToken = await generateVendorOrgRefreshToken({ tokenId: newTokenRow.id, userUUId: vendorOrg.uuid,vendorOrgId: vendorOrg.id });
            const newAccessToken = await signVendorOrgAccessToken({ vendorOrgId: vendorOrg.id, userUUId: vendorOrg.uuid,  tokenId: newTokenRow.id });

            
            const refreshTokenExpiry = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '60') * 24 * 60 * 60 * 1000);
            newTokenRow.refreshToken = newRefreshToken;
            newTokenRow.accessToken = newAccessToken;
            newTokenRow.refreshTokenExpiry = refreshTokenExpiry;
            await vendorOrgTokenRepo.save(newTokenRow);

            const result = createSuccessResponse({ accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Tokens refreshed');
            return reply.status(200).send(result);
          } catch (error) {
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
