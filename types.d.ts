export interface NormalizedFile {
    filename: string;
    mimetype: string;
    sizeBytes: number;
    toBuffer: () => Promise<Buffer>;
}

export interface ParsedMultipart {
    body: Record<string, string | undefined>;
    files: Record<string, NormalizedFile[]>;
}