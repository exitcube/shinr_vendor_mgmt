export type loginVendorOrganizationBody = {
    organizationId: string;
    password: string;
};

export type refreshRequestBody = {
  refreshToken: string;
};