import { API } from "./api.js";
import { intToStr } from "./node/timestamps.js";
export class KeepAPI extends API {
    static API_URL = "https://www.googleapis.com/notes/v1/";
    sessionId;
    constructor(auth = null, fetchFn) {
        super(KeepAPI.API_URL, auth, fetchFn);
        this.sessionId = KeepAPI.generateId(Date.now() / 1000);
    }
    static generateId(timestampSec) {
        const ms = Math.floor(timestampSec * 1000);
        const rand = Math.floor(Math.random() * 9000000000) + 1000000000;
        return `s--${ms}--${rand}`;
    }
    async changes(targetVersion = null, nodes = [], labels = null) {
        const currentTime = Date.now() / 1000;
        const params = {
            nodes,
            clientTimestamp: intToStr(currentTime),
            requestHeader: {
                clientSessionId: this.sessionId,
                clientPlatform: "ANDROID",
                clientVersion: {
                    major: "9",
                    minor: "9",
                    build: "9",
                    revision: "9",
                },
                capabilities: [
                    { type: "NC" },
                    { type: "PI" },
                    { type: "LB" },
                    { type: "AN" },
                    { type: "SH" },
                    { type: "DR" },
                    { type: "TR" },
                    { type: "IN" },
                    { type: "SNB" },
                    { type: "MI" },
                    { type: "CO" },
                ],
            },
        };
        if (targetVersion !== null) {
            params.targetVersion = targetVersion;
        }
        if (labels !== null && labels.length > 0) {
            params.userInfo = { labels };
        }
        return this.send({
            url: `${this.baseUrl}changes`,
            method: "POST",
            json: params,
        });
    }
}
//# sourceMappingURL=keepApi.js.map
