import { type ParsedObjectMetadata } from '../src/library/parse-glb';
export declare function buildDemoChairGlb(): Promise<Buffer>;
export declare function buildDemoChairBundle(): Promise<{
    bytes: Buffer;
    metadata: ParsedObjectMetadata;
}>;
