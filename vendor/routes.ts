import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';
import { validation } from '../utils/validation';
import { loginValidate, refreshTokenValidate, verifyOtpTokenValidate, verifyOtpValidate } from './validators';

export default async function vendorRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const handler = controller(fastify, opts);
    fastify.post('/login/otp', {preHandler: [validation(loginValidate)]},handler.generateOtpHandler);
	fastify.post('/login/verify-otp', {preHandler: [validation(verifyOtpValidate)]},handler.verifyOtpHandler);
	fastify.post('/login/resend-otp', {preHandler:[validation(verifyOtpTokenValidate)]}, handler.resendOtpHandler);
    fastify.post('/login/generate-refreshToken', {preHandler: [validation(refreshTokenValidate)]},handler.generateRefreshTokenHandler);

}
