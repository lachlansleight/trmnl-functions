import type { APIAuth } from "./auth.js";
export type FetchFn = typeof fetch;
export interface SendOptions {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    json?: unknown;
    allowRedirects?: boolean;
}
export declare class API {
    protected readonly baseUrl: string;
    protected readonly fetchFn: FetchFn;
    static readonly RETRY_CNT = 2;
    static readonly VERSION = "0.1.0";
    protected auth: APIAuth | null;
    constructor(baseUrl: string, auth?: APIAuth | null, fetchFn?: FetchFn);
    getAuth(): APIAuth | null;
    setAuth(auth: APIAuth): void;
    send(options: SendOptions): Promise<Record<string, unknown>>;
    sendRaw(options: SendOptions): Promise<Response>;
}
//# sourceMappingURL=api.d.ts.map
