export declare const KEEP_OAUTH_SCOPES =
    "oauth2:https://www.googleapis.com/auth/memento https://www.googleapis.com/auth/reminders";
export declare const KEEP_CLIENT_SIG = "38918a453d07199354f8b19af05ec6562ced5788";
export declare function defaultDeviceId(): string;
export declare class APIAuth {
    private readonly scopes;
    private _masterToken;
    private _authToken;
    private _email;
    private _deviceId;
    constructor(scopes?: string);
    load(email: string, masterToken: string, deviceId: string): Promise<void>;
    getMasterToken(): string;
    getEmail(): string;
    getDeviceId(): string;
    getAuthToken(): string | null;
    refresh(): Promise<string>;
}
//# sourceMappingURL=auth.d.ts.map
