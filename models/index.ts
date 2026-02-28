import { Vendor } from "./Vendor";
import { VendorFile } from "./VendorFile";
import { File } from "./File";
import { VendorOrganization } from "./VendorOrganization";
import { VendorToken } from "./VendorToken";
// import { Product } from './Product';


// Export all entities as an array for TypeORM configuration
export const entities = [
    Vendor,
    VendorFile,
    File,
    VendorOrganization,
    VendorToken
    // Product,
];


// Export individual entities and types
export { Vendor, type Vendor as VendorType } from './Vendor';
export { VendorFile, type VendorFile as VendorFileType } from './VendorFile';
export { File, type File as FileType } from "./File";
export { VendorOrganization, type VendorOrganization as VendorOrganizationType,} from "./VendorOrganization";
export { VendorToken, type VendorToken as VendorTokenType } from "./VendorToken";