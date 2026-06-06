export declare class APIException extends Error {
    readonly code: number;
    constructor(code: number, msg: unknown);
}
export declare class KeepException extends Error {
    constructor(message?: string);
}
export declare class LoginException extends KeepException {
    constructor(message?: string);
}
export declare class BrowserLoginRequiredException extends LoginException {
    readonly url: string;
    constructor(url: string);
}
export declare class SyncException extends KeepException {
    constructor(message?: string);
}
export declare class ResyncRequiredException extends SyncException {
    constructor(message?: string);
}
export declare class UpgradeRecommendedException extends SyncException {
    constructor(message?: string);
}
export declare class MergeException extends KeepException {
    readonly raw: Record<string, unknown>;
    constructor(raw: Record<string, unknown>);
}
export declare class InvalidException extends KeepException {
    constructor(message?: string);
}
export declare class ParseException extends KeepException {
    readonly raw: Record<string, unknown>;
    constructor(message: string, raw: Record<string, unknown>);
}
export declare class LabelException extends KeepException {
    constructor(message?: string);
}
export declare class NotImplementedWriteException extends KeepException {
    constructor(method: string);
}
//# sourceMappingURL=exceptions.d.ts.map
