export class APIException extends Error {
    code;
    constructor(code, msg) {
        super(typeof msg === "string" ? msg : JSON.stringify(msg));
        this.code = code;
        this.name = "APIException";
    }
}
export class KeepException extends Error {
    constructor(message) {
        super(message);
        this.name = "KeepException";
    }
}
export class LoginException extends KeepException {
    constructor(message) {
        super(message);
        this.name = "LoginException";
    }
}
export class BrowserLoginRequiredException extends LoginException {
    url;
    constructor(url) {
        super("Browser login required");
        this.url = url;
        this.name = "BrowserLoginRequiredException";
    }
}
export class SyncException extends KeepException {
    constructor(message) {
        super(message);
        this.name = "SyncException";
    }
}
export class ResyncRequiredException extends SyncException {
    constructor(message) {
        super(message);
        this.name = "ResyncRequiredException";
    }
}
export class UpgradeRecommendedException extends SyncException {
    constructor(message) {
        super(message);
        this.name = "UpgradeRecommendedException";
    }
}
export class MergeException extends KeepException {
    raw;
    constructor(raw) {
        super("Merge conflict");
        this.raw = raw;
        this.name = "MergeException";
    }
}
export class InvalidException extends KeepException {
    constructor(message) {
        super(message);
        this.name = "InvalidException";
    }
}
export class ParseException extends KeepException {
    raw;
    constructor(message, raw) {
        super(message);
        this.raw = raw;
        this.name = "ParseException";
    }
}
export class LabelException extends KeepException {
    constructor(message) {
        super(message);
        this.name = "LabelException";
    }
}
export class NotImplementedWriteException extends KeepException {
    constructor(method) {
        super(`${method} is not implemented yet (read-only MVP)`);
        this.name = "NotImplementedWriteException";
    }
}
//# sourceMappingURL=exceptions.js.map
