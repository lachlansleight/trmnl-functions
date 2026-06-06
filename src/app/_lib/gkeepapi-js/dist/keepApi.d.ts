import { API, type FetchFn } from "./api.js";
export type { FetchFn } from "./api.js";
import type { APIAuth } from "./auth.js";
export declare class KeepAPI extends API {
    static readonly API_URL = "https://www.googleapis.com/notes/v1/";
    private sessionId;
    constructor(auth?: APIAuth | null, fetchFn?: FetchFn);
    static generateId(timestampSec: number): string;
    changes(
        targetVersion?: string | null,
        nodes?: Record<string, unknown>[],
        labels?: Record<string, unknown>[] | null
    ): Promise<Record<string, unknown>>;
}
//# sourceMappingURL=keepApi.d.ts.map
