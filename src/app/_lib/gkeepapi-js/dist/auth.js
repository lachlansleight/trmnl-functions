import { randomBytes } from "node:crypto";
import { networkInterfaces } from "node:os";
import { GPSOAuth } from "gpsoauth-js";
import { LoginException } from "./exceptions.js";
export const KEEP_OAUTH_SCOPES =
    "oauth2:https://www.googleapis.com/auth/memento https://www.googleapis.com/auth/reminders";
export const KEEP_CLIENT_SIG = "38918a453d07199354f8b19af05ec6562ced5788";
export function defaultDeviceId() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name] ?? []) {
            if (!net.internal && net.mac && net.mac !== "00:00:00:00:00:00") {
                return net.mac.replace(/:/g, "").toLowerCase();
            }
        }
    }
    return randomBytes(6).toString("hex");
}
export class APIAuth {
    scopes;
    _masterToken = null;
    _authToken = null;
    _email = null;
    _deviceId = null;
    constructor(scopes = KEEP_OAUTH_SCOPES) {
        this.scopes = scopes;
    }
    async load(email, masterToken, deviceId) {
        this._email = email;
        this._deviceId = deviceId;
        this._masterToken = masterToken;
        await this.refresh();
    }
    getMasterToken() {
        if (!this._masterToken) {
            throw new LoginException("Not logged in");
        }
        return this._masterToken;
    }
    getEmail() {
        if (!this._email) {
            throw new LoginException("Not logged in");
        }
        return this._email;
    }
    getDeviceId() {
        if (!this._deviceId) {
            throw new LoginException("Not logged in");
        }
        return this._deviceId;
    }
    getAuthToken() {
        return this._authToken;
    }
    async refresh() {
        if (!this._email || !this._masterToken || !this._deviceId) {
            throw new LoginException("Not logged in");
        }
        const result = await GPSOAuth.performOAuth(this._email, this._masterToken, {
            service: this.scopes,
            app: "com.google.android.keep",
            clientSig: KEEP_CLIENT_SIG,
            androidId: this._deviceId,
        });
        if (result.error) {
            throw new LoginException(result.error);
        }
        const auth = result.auth;
        if (!auth) {
            throw new LoginException("No auth token returned");
        }
        this._authToken = auth;
        return auth;
    }
}
//# sourceMappingURL=auth.js.map
