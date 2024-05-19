import { ICryptoProvider } from "@queue-it/connector-javascript";
export declare class NextjsCryptoProvider implements ICryptoProvider {
    constructor();
    getSha256Hash(secretKey: string, stringToHash: string): string;
}
