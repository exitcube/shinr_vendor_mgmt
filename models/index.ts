import { Vendor } from "./Vendor";
import { VendorFile } from "./VendorFile";
import { File } from "./File";
import { VendorOrganization } from "./VendorOrganization";
import { VendorOrganizationToken } from "./VendorOrganizationToken";
import { VendorToken } from "./VendorToken";
import{ VendorOtp } from "./VendorOtp";

// import { Product } from './Product';


// Export all entities as an array for TypeORM configuration
export const entities = [
    Vendor,
    VendorFile,
    File,
    VendorOrganization,
    VendorOrganizationToken,
    VendorToken,
    VendorOtp
    // Product,
];


// Export individual entities and types
export { Vendor, type Vendor as VendorType } from './Vendor';
export { VendorFile, type VendorFile as VendorFileType } from './VendorFile';
export { File, type File as FileType } from "./File";
export { VendorOrganization, type VendorOrganization as VendorOrganizationType,} from "./VendorOrganization";
export { VendorOrganizationToken, type VendorOrganizationToken as VendorOrganizationTokenType,} from "./VendorOrganizationToken";
export { VendorToken, type VendorToken as VendorTokenType } from "./VendorToken";
export { VendorOtp, type VendorOtp as VendorOtpType } from "./VendorOtp";