const TZ_FMT = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.(\d+)Z$/;
export class NodeTimestamps {
    _created;
    _deleted = null;
    _trashed = null;
    _updated;
    _edited = null;
    dirty = false;
    constructor(createTimeSec) {
        const t = createTimeSec ?? Date.now() / 1000;
        this._created = intToDt(t);
        this._updated = intToDt(t);
        this._edited = intToDt(t);
    }
    load(raw) {
        if (typeof raw.created === "string") {
            this._created = strToDt(raw.created);
        }
        this._deleted = typeof raw.deleted === "string" ? strToDt(raw.deleted) : null;
        this._trashed = typeof raw.trashed === "string" ? strToDt(raw.trashed) : null;
        if (typeof raw.updated === "string") {
            this._updated = strToDt(raw.updated);
        }
        this._edited = typeof raw.userEdited === "string" ? strToDt(raw.userEdited) : null;
    }
    get created() {
        return this._created;
    }
    get deleted() {
        return this._deleted;
    }
    get trashed() {
        return this._trashed;
    }
    get updated() {
        return this._updated;
    }
    get edited() {
        return this._edited;
    }
}
export function strToDt(value) {
    if (!value) {
        return intToDt(0);
    }
    const match = value.match(TZ_FMT);
    if (match) {
        const [, datePart, frac] = match;
        const ms = frac.slice(0, 3).padEnd(3, "0");
        return new Date(`${datePart}.${ms}Z`);
    }
    return new Date(value);
}
export function intToDt(timestampSec) {
    return new Date(timestampSec * 1000);
}
export function dtToStr(dt) {
    const iso = dt.toISOString();
    return iso.replace(/\.\d{3}Z$/, `.${String(dt.getUTCMilliseconds()).padStart(3, "0")}Z`);
}
export function intToStr(timestampSec) {
    return dtToStr(intToDt(timestampSec));
}
export function epochZero() {
    return intToDt(0);
}
//# sourceMappingURL=timestamps.js.map
