import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import { vendorAccessTokenPayloadType, vendorOrgAccessTokenPayloadType, vendorOrgOtpTokenPayloadType, vendorOrgRefreshTokenPayloadType, vendorRefreshTokenPayloadType } from "../types/config";
const OTP_SECRET = new TextEncoder().encode(process.env.OTP_SECRET || "otptokensceret");
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET || "refreshtokensecret");
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "accesstokensecret");
const REFRESH_TOKEN_EXPIRY_DAYS = process.env.REFRESH_TOKEN_EXPIRY_DAYS ? parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS) : 60;
export async function generateVendorOrgOtpToken(payload : vendorOrgOtpTokenPayloadType) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(OTP_SECRET);
}

export async function verifyVendorOrgOtpToken(token: string) {
  const { payload } = await jwtVerify(token, OTP_SECRET, { algorithms: ["HS256"] });
  return payload as { tokenId : number,userId: number; userUUId: string;  jti: string };
}

export async function generateVendorOrgRefreshToken(payload : vendorOrgRefreshTokenPayloadType) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_EXPIRY_DAYS}d`)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyVendorOrgRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });
  return payload as { tokenId : number,vendorOrgId: number; userUUId: string;  jti: string };
}

// This handles the public and private key concept 
// Disabling for now for the sake of simplicity
// let privateKey: CryptoKey;
// let publicKey: CryptoKey;

// (async () => {
//   privateKey = await crypto.subtle.importKey(
//     "pkcs8",
//     Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY!, "base64"),
//     { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
//     false,
//     ["sign"]
//   );

//   publicKey = await crypto.subtle.importKey(
//     "spki",
//     Buffer.from(process.env.ACCESS_TOKEN_PUBLIC_KEY!, "base64"),
//     { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
//     false,
//     ["verify"]
//   );
// })();
// End of public and private key concept

export async function signVendorOrgAccessToken(payload : vendorOrgAccessTokenPayloadType) {
  const jti = randomUUID();

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("15m") 
    .sign(ACCESS_TOKEN_SECRET);
}


export async function verifyVendorOrgAccessToken(token: string) {
  const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] });
  return payload as { vendorOrgId: number; userUUId: string;  jti: string; tokenId: number};
}


export async function generateVendorRefreshToken(payload : vendorRefreshTokenPayloadType) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_EXPIRY_DAYS}d`)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function signVendorAccessToken(payload : vendorAccessTokenPayloadType) {
  const jti = randomUUID();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("15m") 
    .sign(ACCESS_TOKEN_SECRET);
}
export async function verifyVendorRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });
  return payload as { vendorId: number; userUUID: string; tokenId: number; jti: string };
}

export async function verifyVendorAccessToken(token: string) {
  const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] });
  return payload as { vendorId: number; userUUID: string; tokenId: number; jti: string };
}