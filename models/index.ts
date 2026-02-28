
import { File } from "./File";
import { VendorOrganization } from "./VendorOrganization";
import { VendorOrganizationToken } from "./VendorOrganizationToken";
 import{ VendorOrgOtp } from "./VendorOrgOtp";

// import { Product } from './Product';


// Export all entities as an array for TypeORM configuration
export const entities = [
    File,
    VendorOrganization,
    VendorOrganizationToken,
    VendorOrganizationToken,
    VendorOrgOtp
    // Product,
];


// Export individual entities and types
 
export { File, type File as FileType } from "./File";
export { VendorOrganization, type VendorOrganization as VendorOrganizationType,} from "./VendorOrganization";
export { VendorOrganizationToken, type VendorOrganizationToken as VendorOrganizationTokenType,} from "./VendorOrganizationToken";
export { VendorOrgOtp, type VendorOrgOtp as VendorOrgOtpType } from "./VendorOrgOtp";