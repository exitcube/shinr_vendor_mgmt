
export interface registerVendorBody {
    businessName: string;
    ownerName: string;
    phone: string;
    email?: string;
    password: string;
    location?: {
        address: string;
        lat: number;
        lng: number;
    };
    serviceType?: string[];
}

export interface loginVendorBody {
    identifier: string; // phone or email
    password: string;
}
