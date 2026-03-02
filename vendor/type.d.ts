export type loginVendorBody = {
    vendorCode: string;
    password: string;
};

export type refreshRequestBody = {
  refreshToken: string;
};