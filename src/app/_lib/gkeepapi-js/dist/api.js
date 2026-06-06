import { LoginException, APIException } from "./exceptions.js";
export class API {
    baseUrl;
    fetchFn;
    static RETRY_CNT = 2;
    static VERSION = "0.1.0";
    auth = null;
    constructor(baseUrl, auth = null, fetchFn = fetch) {
        this.baseUrl = baseUrl;
        this.fetchFn = fetchFn;
        this.auth = auth;
    }
    getAuth() {
        return this.auth;
    }
    setAuth(auth) {
        this.auth = auth;
    }
    async send(options) {
        let attempts = 0;
        let delay = 2;
        while (true) {
            const response = await this.sendRaw(options);
            const body = await response.json();
            if (!("error" in body)) {
                return body;
            }
            const error = body.error;
            const code = error.code ?? response.status;
            if (code === 429) {
                await sleep(delay * 1000);
                delay = Math.min(delay * 2, 60);
                continue;
            }
            if (code !== 401) {
                throw new APIException(code, error);
            }
            if (attempts >= API.RETRY_CNT) {
                throw new APIException(code, error);
            }
            await this.auth?.refresh();
            attempts += 1;
        }
    }
    async sendRaw(options) {
        const authToken = this.auth?.getAuthToken();
        if (!authToken) {
            throw new LoginException("Not logged in");
        }
        const headers = {
            "User-Agent": `x-gkeepapi/${API.VERSION} (https://github.com/kiwiz/gkeepapi)`,
            Authorization: `OAuth ${authToken}`,
            ...(options.headers ?? {}),
        };
        if (options.json !== undefined) {
            headers["Content-Type"] = "application/json";
        }
        return this.fetchFn(options.url, {
            method: options.method ?? "GET",
            headers,
            body: options.json !== undefined ? JSON.stringify(options.json) : undefined,
            redirect: options.allowRedirects === false ? "manual" : "follow",
        });
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=api.js.map
